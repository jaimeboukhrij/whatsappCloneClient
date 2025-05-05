import { ChatRoomMessageI } from '../../chats-room/interfaces'

export interface ChatStarredMessagesViewI {
  title: string
  urlImg: string | null
  messageDate: string
  messageHour: string
  text: string
  message: ChatRoomMessageI
}