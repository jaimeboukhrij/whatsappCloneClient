import {  IUser } from '../../../shared/interfaces/user.interface'

export interface ChatRoomMessageI {
  id: string
  text: string
  date: Date
  owner: IUser
  chatRoomId: string
  type: 'received' | 'sent'
  isRead: boolean
}

export interface ChatRoomCreateMessageI {
  text: string
  ownerId: string
  chatRoomId: string
}
