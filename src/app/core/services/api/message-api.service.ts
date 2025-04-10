import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { ChatRoomCreateMessageI, ChatRoomMessageI } from '../../../modules/chats/model/chat-room-messages.interface'

interface updateManymessagesI {
  id: string
  isRead: boolean
}
@Injectable({ providedIn: 'root' })
export class MessageApiService {
  constructor (private readonly apiService: ApiService) {}

  createApiMessage (message: ChatRoomCreateMessageI) {
    const messageToSend = {
      text: message.text,
      ownerId: message.ownerId,
      chatRoomId: message.chatRoomId
    }

    return this.apiService.fetchApi<ChatRoomMessageI>(
      '/messages',
      messageToSend,
      'POST'
    )
  }


  updateMany (message: updateManymessagesI[]) {
    return this.apiService.fetchApi<ChatRoomMessageI>(
      '/messages/update-many',
      message,
      'PUT'
    )
  }
}
