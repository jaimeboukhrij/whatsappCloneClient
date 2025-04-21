import {  IUser } from '../../../shared/interfaces/user.interface'
import { ChatRoomMessageI } from './chat-room-messages.interface'

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
  notificationsSilenced: NotificationsSilencedEnum | null
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

export enum NotificationsSilencedEnum {
  HOUR = 'hour',
  WEEK = 'week',
  ALWAYS = 'always',
}

export interface ChatPreviewFiltersInterface {
  query?: string
  all: boolean
  noRead?: boolean
  favorite?: boolean
  groups?: boolean
}

export enum ChatPreviewFiltersEnum {
  QUERY = 'query',
  ALL = 'all',
  NO_READ = 'noRead',
  FAVORITE = 'favorite',
  GROUPS = 'groups',
  ARCHIVED = 'archived',
}

export interface MessagesDataI {
  lastMessage: string | null
  lastMessageUser: string | null
  isUserMessage: boolean
  lastTwentyMessage: ChatRoomMessageI[] | null
  messagesWithOutRead: number | null
  isRead: boolean
}
