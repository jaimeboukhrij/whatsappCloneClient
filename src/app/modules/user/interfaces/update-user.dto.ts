import { NotificationsSilencedEnum } from '../../chats/model'

export interface BooleanItem {
  chatRoomId: string
  value: boolean
}

export interface EnumItem {
  chatRoomId: string
  value: NotificationsSilencedEnum
}

export interface DateItem {
  chatRoomId: string
  value: Date
}

export interface UpdateUserDtoI {
  lastSeen?: string
  chatsRoomArchived?: BooleanItem[]
  chatsRoomNotificationsSilenced?: EnumItem[]
  chatsRoomPinned?: DateItem[]
  chatsRoomFavorites?: BooleanItem[]
  chatsRoomBlocked?: BooleanItem[]
}
