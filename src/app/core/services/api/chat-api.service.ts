import { Injectable } from '@angular/core'
import {  ChatI } from '../../../modules/chats/model'
import {  ApiService } from './api.service'

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  constructor (private readonly apiService: ApiService) {}

  createChat (contactId: string, type: 'private' | 'group') {
    if (!contactId) {
      console.error('Contact ID is required to create a chat room')
      return
    }

    return this.apiService.fetchApi<ChatI>(
      '/chats-room',
      { users: [contactId], type },
      'POST'
    )
  }

  deleteChat (ChatId: string) {
    return this.apiService.fetchApi<ChatI>(
      `/chats-room/${ChatId}`,
      {},
      'DELETE'
    )
  }

}
