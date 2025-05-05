import {  IUser } from '../../../../../shared/interfaces/user.interface'
import { ChatI } from '../../../interfaces'

export interface ChatRoomMessageI {
  id: string
  text: string
  date: string
  owner: IUser
  chatRoomId: string
  chatRoom: ChatI
  type: 'received' | 'sent'
  isRead: boolean
  isDelivered: boolean
  hideFor?: string[] | null
  starredBy: IUser[] | null
  messageHour: string
  messageDate: string
}

export interface ChatRoomCreateMessageI {
  text: string
  ownerId: string
  chatRoomId: string
}

export interface ChatRoomUpdateMessageI {
  id: string
  isRead?: boolean
  hideFor?: string[]
  starredByUserId?: string
}
