import { ChatI } from '../../../interfaces'

export interface UpdateChatRoomDto extends Partial<ChatI> {
  usersId: string[]
}





