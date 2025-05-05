import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { ChatRoomCreateMessageI, ChatRoomMessageI, ChatRoomUpdateMessageI } from '../../../modules/chats/components/chats-room/interfaces/chat-room-messages.interface'
import { Observable } from 'rxjs'


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


  updateMany (message: ChatRoomUpdateMessageI[]) {
    return this.apiService.fetchApi<ChatRoomMessageI[]>(
      '/messages/update-many',
      message,
      'PUT'
    )
  }

  deleteMany (messagesIds: string[]): Observable<unknown> {
    return this.apiService.fetchApi<unknown>(
      '/messages/delete-many',
      messagesIds,
      'PUT'
    )
  }


}
