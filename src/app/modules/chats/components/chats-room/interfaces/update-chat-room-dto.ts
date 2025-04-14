import { ChatRoomMessageI } from '../../../model/chat-room-messages.interface'

export interface UpdateChatRoomDto {
  id: string
  name: string
  lastChatMessage: string
  lastChatMessageHour: Date
  messagesWithoutRead: number
  isUserMessage: boolean
  messages: ChatRoomMessageI[]
  urlImg: string
  isArchived: boolean
  notificationsSilenced: NotificationsSilencedEnum | null
  isPinned: Date | null
  isRead: boolean
  inFavorites: boolean
  isBlocked: boolean
  showOptions: boolean
  type: 'private' | 'group'
  users: string[]
  createdAt: Date
  contactUserId?: string
  lastSeen?: string
}

export enum NotificationsSilencedEnum {
  HOUR = 'hour',
  WEEK = 'week',
  ALWAYS = 'always',
}



