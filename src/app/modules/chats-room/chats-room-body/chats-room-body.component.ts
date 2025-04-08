import { Component, inject } from '@angular/core';
import { ChatsRoomService } from '../services/chats-room.service';

@Component({
  selector: 'chats-room-body',
  standalone: false,

  templateUrl: './chats-room-body.component.html',
  styleUrl: './chats-room-body.component.css',
})
export class ChatsRoomBodyComponent {
  private readonly chatsRoomService = inject(ChatsRoomService);
  public messages = this.chatsRoomService.chatRoomMessages;
}
