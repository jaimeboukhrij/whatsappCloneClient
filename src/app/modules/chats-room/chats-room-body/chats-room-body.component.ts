import { Component, inject, type OnInit, type WritableSignal } from '@angular/core'
import { ChatsRoomService } from '../services/chats-room.service'
import { type ChatRoomMessageI } from '../interfaces/chat-room-messages.interface'
import { ChatRoomMessagesService } from '../services/chats-room-messages.service'

@Component({
  selector: 'chats-room-body',
  standalone: false,

  templateUrl: './chats-room-body.component.html',
  styleUrl: './chats-room-body.component.css'
})
export class ChatsRoomBodyComponent implements OnInit {
  private readonly chatsRoomService = inject(ChatsRoomService)
  private readonly chatRoomMessagesService = inject(ChatRoomMessagesService)
  public messages: WritableSignal<ChatRoomMessageI[]> =
    this.chatRoomMessagesService.chatRoomMessages

  ngOnInit (): void {
    const currentChatRoomDataMessages = this.chatsRoomService.currentChatRoomData()?.messages ?? []
    this.chatRoomMessagesService.updateChatRoomMessage(currentChatRoomDataMessages)
  }
}
