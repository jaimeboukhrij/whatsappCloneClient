import { ChatRoomMessageI } from '../../chats-room/interfaces/chat-room-messages.interface'

export interface ChatPreviewMessagesDataI {
  lastMessage: string | null
  lastMessageHour: string
  lastMessageUser: string | null
  isUserMessage: boolean
  lastTwentyMessage: ChatRoomMessageI[] | null
  messagesWithOutRead: number | null
  isRead: boolean
  isDelivered: boolean
}
