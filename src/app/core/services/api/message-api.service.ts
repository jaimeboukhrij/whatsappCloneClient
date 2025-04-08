import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  ChatRoomCreateMessageI,
  ChatRoomMessageI,
} from '../../../modules/chats-room/interfaces/chat-room-messages.interface';

@Injectable({ providedIn: 'root' })
export class MessageApiService {
  constructor(private readonly apiService: ApiService) {}

  createApiMessage(message: ChatRoomCreateMessageI) {
    return this.apiService.fetchApi<ChatRoomMessageI>(
      '/messages',
      {
        text: message.text,
        ownerId: message.ownerId,
        chatRoomId: message.chatRoomId,
      } as ChatRoomCreateMessageI,
      'POST'
    );
  }
}
