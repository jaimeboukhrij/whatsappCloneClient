import { Injectable } from '@angular/core'
import {  ChatI } from '../../../modules/chats/model'
import {  ApiService } from './api.service'
import { of } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  constructor (private readonly apiService: ApiService) {}

  createChat (contactId: string, type: 'private' | 'group') {
    if (!contactId) {
      return of()
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
