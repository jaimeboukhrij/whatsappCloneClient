import { Injectable } from '@angular/core'
import {  ChatI } from '../../../modules/chats/model'
import {  ApiService } from './api.service'

@Injectable({ providedIn: 'root' })
export class ChatRoomApiService {
  constructor (private readonly apiService: ApiService) {}



  updateChatRoom (ChatId: string, data: Partial<ChatI>) {
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
