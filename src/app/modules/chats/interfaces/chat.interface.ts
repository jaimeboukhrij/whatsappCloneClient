import {  IUser } from '../../../shared/interfaces/user.interface'
import { ChatRoomMessageI } from '../components/chats-room/interfaces/chat-room-messages.interface'

export interface ChatI {
  id: string
  name: string
  lastChatMessage: string
  lastChatMessageHour: Date
  messagesWithoutRead: number
  isUserLastMessage: boolean
  messages: ChatRoomMessageI[]
  urlImg: string
  isArchived: boolean
  notificationsSilenced: ChatINotificationsSilencedEnum | null
  isPinned: Date | null
  isRead: boolean
  inFavorites: boolean
  isBlocked: boolean
  showOptions: boolean
  type: 'private' | 'group'
  users: IUser[]
  createdAt: Date
  contactUserId?: string
  lastSeen?: string
}

export enum ChatINotificationsSilencedEnum {
  HOUR = 'hour',
  WEEK = 'week',
  ALWAYS = 'always',
}



export enum ChatFiltersEnum {
  QUERY = 'query',
  ALL = 'all',
  NO_READ = 'noRead',
  FAVORITE = 'favorite',
  GROUPS = 'groups',
  ARCHIVED = 'archived',
}

