import { ChatRoomI } from '../../chats/model';
import { ChatRoomApiService } from '../../../core/services/api/chat-room-api.service';
import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatsRoomService {
  currentChatRoomId = signal('');
  currentChatRoomData: WritableSignal<ChatRoomI | null> = signal(null);

  constructor(private readonly chatRoomApiService: ChatRoomApiService) {}

  showChatRoomData(id: string) {
    this.chatRoomApiService.findOneChatRoom(id).subscribe({
      next: (data) => {
        console.log(data);
        this.currentChatRoomData.set(data);
      },
    });
  }
}
