import { Injectable } from '@angular/core'
import {  ChatI } from '../../../modules/chats/interfaces'
import {  ApiService } from './api.service'
import { of } from 'rxjs'
import { UpdateChatRoomDto } from '../../../modules/chats/components/chats-room/interfaces/chat-room-update.dto'
import { CreateChatRoomDto } from '../../../modules/chats/components/chats-room/interfaces'


@Injectable({ providedIn: 'root' })
export class ChatRoomApiService {
  constructor (private readonly apiService: ApiService) {}

  createChatRoom (createChatRoomDto: CreateChatRoomDto) {
    if (!createChatRoomDto.membersIds.length) {
      return of()
    }

    return this.apiService.fetchApi<ChatI>(
      '/chats-room',
      createChatRoomDto,
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
