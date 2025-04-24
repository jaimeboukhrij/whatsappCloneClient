import { Component, inject,  OnInit,  WritableSignal } from '@angular/core'
import {  ChatRoomMessageI } from '../../../../model/chat-room-messages.interface'
import { ChatRoomMessagesService } from '../chats-room-messages/services/chats-room-messages.service'

@Component({
  selector: 'chats-room-body',
  standalone: false,
  templateUrl: './chats-room-body.component.html',
  styleUrl: './chats-room-body.component.css'
})
export class ChatsRoomBodyComponent implements OnInit {

  private readonly chatRoomMessagesService = inject(ChatRoomMessagesService)
  public messages: WritableSignal<ChatRoomMessageI[]> = this.chatRoomMessagesService.chatRoomMessages
  ngOnInit (): void {
    // this.chatRoomMessagesService.getChatRoomMessages()
  }


}
