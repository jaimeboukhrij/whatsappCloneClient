import {  IUser } from '../../../shared/interfaces/user.interface'

export interface ChatRoomMessageI {
  id: string
  text: string
  date: string
  owner: IUser
  chatRoomId: string
  type: 'received' | 'sent'
  isRead: boolean
  isDelivered: boolean
  hideFor?: string[] | null
  starredByUserId: string | null
}

export interface ChatRoomCreateMessageI {
  text: string
  ownerId: string
  chatRoomId: string
}
