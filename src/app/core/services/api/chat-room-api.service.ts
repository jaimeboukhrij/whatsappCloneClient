import { Injectable } from '@angular/core'
import {  ChatI } from '../../../modules/chats/model'
import {  ApiService } from './api.service'
import { of } from 'rxjs'
import { UpdateChatRoomDto } from '../../../modules/chats/components/chats-room/interfaces/update-chat-room-dto'


@Injectable({ providedIn: 'root' })
export class ChatRoomApiService {
  constructor (private readonly apiService: ApiService) {}

  createChatRoom (contactId: string, type: 'private' | 'group') {
    if (!contactId) {
      return of()
    }

    return this.apiService.fetchApi<ChatI>(
      '/chats-room',
      { users: [contactId], type },
      'POST'
    )
  }

  deleteChatRoom (ChatId: string) {
    return this.apiService.fetchApi<ChatI>(
      `/chats-room/${ChatId}`,
      {},
      'DELETE'
    )
  }





  updateChatRoom (ChatId: string, data: Partial<UpdateChatRoomDto>) {
    return this.apiService.fetchApi<ChatI>(
      `/chats-room/${ChatId}`,
      data,
      'PATCH'
    )
  }

  findOneChatRoom (ChatId: string) {
    return this.apiService.fetchApi<ChatI>(`/chats-room/${ChatId}`)
  }

  getChatRoomByContactUserId (contactId: string) {
    return this.apiService.fetchApi<ChatI>(`/chats-room/find-contact-chat-room/${contactId}`)
  }
}
