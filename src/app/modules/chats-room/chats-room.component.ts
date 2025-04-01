import { ChatRoomI } from '../chats/model';
import { ChatsRoomService } from './services/chats-room.service';
import { Component, inject, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-chats-room',
  standalone: false,

  templateUrl: './chats-room.component.html',
  styles: ``,
})
export class ChatsRoomComponent {
  private readonly chatsRoomService = inject(ChatsRoomService);
  currentChatRoomData: WritableSignal<ChatRoomI | null> =
    this.chatsRoomService.currentChatRoomData;
}
