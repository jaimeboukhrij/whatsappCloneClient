import { Component, inject } from '@angular/core';
import { ChatsRoomService } from '../services/chats-room.service';

@Component({
  selector: 'chats-room-header',
  standalone: false,

  templateUrl: './chats-room-header.component.html',
  styles: ``,
})
export class ChatsRoomHeaderComponent {
  private readonly chatsRoomService = inject(ChatsRoomService);
  public chatRoomData = this.chatsRoomService.currentChatRoomData;
}
