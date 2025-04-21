import { BooleanItem, EnumItem, DateItem } from '../../modules/user/interfaces/update-user.dto'

export interface IUser {
  id: string
  email: string
  password: string
  userName: string
  lastName: string
  firstName: string
  urlImg?: string | null
  contacts?: IUser[] | null
  token?: string
  lastSeen?: string
  chatsRoomArchived: BooleanItem[]
  chatsRoomNotificationsSilenced: EnumItem[]
  chatsRoomPinned: DateItem[]
  chatsRoomFavorites: BooleanItem[]
  chatsRoomBlocked: BooleanItem[]
}
