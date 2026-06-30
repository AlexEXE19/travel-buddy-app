import { getChatRooms, getAuthTokenForClient } from "@/src/features/chat/actions"
import { ChatView } from "./chat-view"

export default async function ChatPage() {
  const [rooms, token] = await Promise.all([getChatRooms(), getAuthTokenForClient()])
  return <ChatView initialRooms={rooms ?? []} authToken={token ?? ""} />
}
