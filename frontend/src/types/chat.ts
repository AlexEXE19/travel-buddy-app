export interface ChatRoom {
  id: string
  type: "DM" | "TRIP"
  referenceId: string | null
  name: string | null
  createdAt: string
  participantIds: string[]
  lastMessage: ChatMessage | null
}

export interface ChatParticipant {
  userId: string
  firstName: string | null
  lastName: string | null
  profilePictureUrl: string | null
}

export interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  content: string | null
  type: "TEXT" | "TRIP_SHARE"
  tripId: string | null
  sentAt: string
  editedAt: string | null
  deleted: boolean
}

export interface WsEvent {
  eventType: "NEW_MESSAGE" | "EDIT_MESSAGE" | "DELETE_MESSAGE"
  payload: ChatMessage
}
