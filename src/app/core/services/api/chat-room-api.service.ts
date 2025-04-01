import { Injectable } from '@angular/core';
import { ChatRoomI } from '../../../modules/chats/model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ChatRoomApiService {
  constructor(private readonly apiService: ApiService) {}

  createChatRoom(contactId: string, type: 'private' | 'group') {
    if (!contactId) {
      console.error('Contact ID is required to create a chat room');
      return;
    }

    return this.apiService.fetchApi<ChatRoomI>(
      '/chats-room',
      { users: [contactId], type },
      'POST'
    );
  }

  deleteChatRoom(chatRoomId: string) {
    return this.apiService.fetchApi<ChatRoomI>(
      `/chats-room/${chatRoomId}`,
      {},
      'DELETE'
    );
  }
  updateChatRoom(chatRoomId: string, data: Partial<ChatRoomI>) {
    return this.apiService.fetchApi<ChatRoomI>(
      `/chats-room/${chatRoomId}`,
      data,
      'PATCH'
    );
  }

  findOneChatRoom(chatRoomId: string) {
    return this.apiService.fetchApi<ChatRoomI>(`/chats-room/${chatRoomId}`);
  }
}
