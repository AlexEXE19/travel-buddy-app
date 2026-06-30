"use client"

import { useState, useEffect, useRef } from "react"
import { Client } from "@stomp/stompjs"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import {
  Send,
  MessageCircle,
  Plane,
  Edit2,
  Trash2,
  X,
  Check,
  MapPin,
  Users,
} from "lucide-react"
import { getRoomMessages, getProfilesByIds } from "@/src/features/chat/actions"
import type { ChatRoom, ChatMessage, WsEvent, ChatParticipant } from "@/src/types/chat"
import { cn } from "@/src/lib/utils"
import Link from "next/link"

// Resolve the chat WebSocket URL at runtime.
// Priority: explicit env override → same host the browser used to load the app
// (handles localhost, LAN IPs and forwarded/remote hosts) → localhost fallback.
function resolveChatWsUrl(): string {
  if (process.env.NEXT_PUBLIC_CHAT_WS_URL) return process.env.NEXT_PUBLIC_CHAT_WS_URL
  if (typeof window !== "undefined") {
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:"
    return `${proto}//${window.location.hostname}:8086`
  }
  return "ws://localhost:8086"
}

const AVATAR_COLORS = ["#0891b2", "#7c3aed", "#0d9488", "#d97706", "#db2777", "#2563eb", "#c026d3"]
function avatarColor(id: string) {
  return AVATAR_COLORS[(id?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length]
}
function initials(first: string | null, last: string | null) {
  return ((first?.[0] ?? "") + (last?.[0] ?? "")).toUpperCase() || "?"
}

interface ChatViewProps {
  initialRooms: ChatRoom[]
  authToken: string
}

export function ChatView({ initialRooms, authToken }: ChatViewProps) {
  const [rooms] = useState<ChatRoom[]>(initialRooms)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(initialRooms[0]?.id ?? null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [people, setPeople] = useState<Record<string, ChatParticipant>>({})
  const stompRef = useRef<Client | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)

  // Decode JWT to extract userId (client-side display only)
  const myUserId = authToken
    ? (() => {
        try {
          return JSON.parse(atob(authToken.split(".")[1])).sub as string
        } catch {
          return ""
        }
      })()
    : ""

  // Resolve all participant profiles (names + avatars) once
  useEffect(() => {
    const ids = Array.from(new Set(rooms.flatMap((r) => r.participantIds))).filter(
      (id) => id !== myUserId
    )
    if (ids.length === 0) return
    getProfilesByIds(ids).then((list) => {
      setPeople(Object.fromEntries(list.map((p) => [p.userId, p])))
    })
  }, [rooms, myUserId])

  // Connect to WebSocket on mount
  useEffect(() => {
    if (!authToken) return
    const client = new Client({
      brokerURL: `${resolveChatWsUrl()}/ws`,
      connectHeaders: { Authorization: `Bearer ${authToken}` },
      reconnectDelay: 5000,
      onConnect: () => setIsConnected(true),
      onDisconnect: () => setIsConnected(false),
      onWebSocketClose: () => setIsConnected(false),
    })
    client.activate()
    stompRef.current = client
    return () => {
      client.deactivate()
    }
  }, [authToken])

  // Subscribe to the selected room when connected
  useEffect(() => {
    if (!selectedRoomId || !isConnected || !stompRef.current) return
    subscriptionRef.current?.unsubscribe()
    subscriptionRef.current = stompRef.current.subscribe(`/topic/room/${selectedRoomId}`, (frame) => {
      const event: WsEvent = JSON.parse(frame.body)
      if (event.eventType === "NEW_MESSAGE") {
        setMessages((prev) => [...prev, event.payload])
      } else {
        setMessages((prev) => prev.map((m) => (m.id === event.payload.id ? event.payload : m)))
      }
    })
    return () => subscriptionRef.current?.unsubscribe()
  }, [selectedRoomId, isConnected])

  // Load messages when room changes
  useEffect(() => {
    if (!selectedRoomId) return
    getRoomMessages(selectedRoomId).then((msgs) => setMessages(msgs ?? []))
  }, [selectedRoomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function sendMessage() {
    if (!input.trim() || !selectedRoomId || !stompRef.current?.connected) return
    stompRef.current.publish({
      destination: `/app/room/${selectedRoomId}/message`,
      body: JSON.stringify({ content: input.trim() }),
    })
    setInput("")
  }

  function submitEdit(msgId: string) {
    if (!editContent.trim() || !selectedRoomId || !stompRef.current?.connected) return
    stompRef.current.publish({
      destination: `/app/room/${selectedRoomId}/message/${msgId}/edit`,
      body: JSON.stringify({ content: editContent.trim() }),
    })
    setEditingId(null)
    setEditContent("")
  }

  function deleteMessage(msgId: string) {
    if (!selectedRoomId || !stompRef.current?.connected) return
    stompRef.current.publish({
      destination: `/app/room/${selectedRoomId}/message/${msgId}/delete`,
      body: "{}",
    })
  }

  function otherPerson(room: ChatRoom): ChatParticipant | undefined {
    const id = room.participantIds.find((p) => p !== myUserId)
    return id ? people[id] : undefined
  }

  function roomTitle(room: ChatRoom) {
    if (room.type === "TRIP") return room.name ?? "Trip chat"
    const p = otherPerson(room)
    if (p) return [p.firstName, p.lastName].filter(Boolean).join(" ") || "Traveler"
    return "Direct message"
  }

  function lastPreview(room: ChatRoom) {
    const m = room.lastMessage
    if (!m) return "No messages yet"
    if (m.deleted) return "Message deleted"
    if (m.type === "TRIP_SHARE") return "🛫 Shared a trip"
    return m.content ?? ""
  }

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId)

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex h-[calc(100vh-9.5rem)] max-h-[760px] overflow-hidden rounded-2xl border border-border bg-card/60 shadow-xl backdrop-blur">
        {/* Sidebar */}
        <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-background/40">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-bold tracking-tight gradient-text">Messages</h2>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  isConnected ? "bg-emerald-500 shadow-[0_0_0_3px] shadow-emerald-500/20" : "bg-amber-400"
                )}
              />
              <span className="text-xs text-muted-foreground">
                {isConnected ? "Connected" : "Connecting…"}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {rooms.length === 0 && (
              <div className="px-3 py-8 text-center">
                <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="mt-2 text-xs text-muted-foreground">
                  No chats yet. Match with travelers or join a trip to start chatting.
                </p>
              </div>
            )}

            {rooms.map((room) => {
              const active = selectedRoomId === room.id
              const person = otherPerson(room)
              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={cn(
                    "mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
                    active ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted/60"
                  )}
                >
                  {/* Avatar */}
                  {room.type === "TRIP" ? (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <Plane className="h-5 w-5" />
                    </span>
                  ) : person?.profilePictureUrl ? (
                    <img
                      src={person.profilePictureUrl}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ background: avatarColor(room.id) }}
                    >
                      {person ? initials(person.firstName, person.lastName) : "DM"}
                    </span>
                  )}

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {roomTitle(room)}
                      </span>
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {lastPreview(room)}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Thread */}
        <section className="flex min-w-0 flex-1 flex-col">
          {!selectedRoom ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
              <MessageCircle className="h-12 w-12 opacity-30" />
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <header className="flex items-center gap-3 border-b border-border bg-background/40 px-5 py-3">
                {selectedRoom.type === "TRIP" ? (
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <Plane className="h-4 w-4" />
                  </span>
                ) : (
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ background: avatarColor(selectedRoom.id) }}
                  >
                    {(() => {
                      const p = otherPerson(selectedRoom)
                      return p ? initials(p.firstName, p.lastName) : "DM"
                    })()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {roomTitle(selectedRoom)}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    {selectedRoom.type === "TRIP" ? (
                      <>
                        <Users className="h-3 w-3" /> {selectedRoom.participantIds.length} member
                        {selectedRoom.participantIds.length === 1 ? "" : "s"}
                      </>
                    ) : (
                      "Direct message"
                    )}
                  </p>
                </div>
                {selectedRoom.type === "TRIP" && selectedRoom.referenceId && (
                  <Link
                    href={`/trips`}
                    className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    <MapPin className="h-3 w-3" /> View trip
                  </Link>
                )}
              </header>

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {messages.length === 0 && (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No messages yet — say hi! 👋
                  </p>
                )}
                {messages.map((msg) => {
                  const isMe = msg.senderId === myUserId
                  const sender = people[msg.senderId]

                  if (msg.type === "TRIP_SHARE") {
                    return (
                      <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                        <div className="max-w-xs space-y-2 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5 p-4 shadow-sm">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                            <Plane className="h-3.5 w-3.5" /> Trip invite
                          </div>
                          <p className="text-sm font-semibold text-foreground">{msg.content}</p>
                          {msg.tripId && (
                            <Link href={`/trips`}>
                              <Button size="sm" className="h-8 w-full text-xs">
                                View &amp; Join
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={msg.id} className={cn("group flex gap-2", isMe ? "justify-end" : "justify-start")}>
                      {!isMe &&
                        (sender?.profilePictureUrl ? (
                          <img
                            src={sender.profilePictureUrl}
                            alt=""
                            className="mt-auto h-7 w-7 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <span
                            className="mt-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                            style={{ background: avatarColor(msg.senderId) }}
                          >
                            {sender ? initials(sender.firstName, sender.lastName) : "?"}
                          </span>
                        ))}

                      <div className={cn("relative max-w-xs lg:max-w-md", isMe ? "items-end" : "items-start")}>
                        {editingId === msg.id ? (
                          <div className="flex items-center gap-1">
                            <Input
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") submitEdit(msg.id)
                                if (e.key === "Escape") setEditingId(null)
                              }}
                              className="h-8 text-sm"
                              autoFocus
                            />
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => submitEdit(msg.id)}>
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingId(null)}>
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "break-words px-4 py-2 text-sm shadow-sm",
                              msg.deleted
                                ? "rounded-2xl bg-muted text-xs italic text-muted-foreground"
                                : isMe
                                ? "rounded-2xl rounded-br-md bg-gradient-to-br from-primary to-accent text-primary-foreground"
                                : "rounded-2xl rounded-bl-md bg-muted text-foreground"
                            )}
                          >
                            {msg.deleted ? "This message was deleted." : msg.content}
                            {msg.editedAt && !msg.deleted && (
                              <span className="ml-1 text-[10px] opacity-60">(edited)</span>
                            )}
                          </div>
                        )}
                        <div className={cn("mt-0.5 px-1 text-[10px] text-muted-foreground", isMe ? "text-right" : "text-left")}>
                          {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>

                        {isMe && !msg.deleted && editingId !== msg.id && (
                          <div className="absolute -top-7 right-0 hidden gap-0.5 rounded-lg border border-border bg-background px-1 py-0.5 shadow-md group-hover:flex">
                            <button
                              onClick={() => {
                                setEditingId(msg.id)
                                setEditContent(msg.content ?? "")
                              }}
                              className="rounded p-1 hover:text-primary"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button onClick={() => deleteMessage(msg.id)} className="rounded p-1 hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              {/* Composer */}
              <div className="flex items-center gap-2 border-t border-border bg-background/40 p-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Type a message…"
                  className="h-10 flex-1 rounded-full border-border bg-card px-4"
                />
                <Button
                  size="icon"
                  onClick={sendMessage}
                  disabled={!input.trim() || !isConnected}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
