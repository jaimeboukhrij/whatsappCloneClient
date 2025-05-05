import { Component, inject } from '@angular/core'
import { ChatRoomMessageI } from '../../interfaces/chat-room-messages.interface'
import { ChatRoomMessagesService } from '../chats-room-messages/services/chats-room-messages.service'
import { WritableSignal } from '@angular/core'

@Component({
  selector: 'chats-room-body',
  standalone: false,
  templateUrl: './chats-room-body.component.html',



  styleUrl: './chats-room-body.component.css'
})
export class ChatsRoomBodyComponent {

  private readonly chatRoomMessagesService = inject(ChatRoomMessagesService)
  public messages: WritableSignal<ChatRoomMessageI[]> = this.chatRoomMessagesService.chatRoomMessages


}
