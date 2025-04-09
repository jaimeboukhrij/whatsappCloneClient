import {  ChatI } from '../chats/model'
import { ChatRoomMessagesService } from './services/chats-room-messages.service'
import { ChatsRoomService } from './services/chats-room.service'
import { Component, inject,  OnInit,  WritableSignal } from '@angular/core'

@Component({
  selector: 'app-chats-room',
  standalone: false,

  templateUrl: './chats-room.component.html',
  styles: ''
})
export class ChatsRoomComponent implements OnInit {
  private readonly chatsRoomService = inject(ChatsRoomService)
  private readonly chatRoomMessagesService = inject(ChatRoomMessagesService)

  public currentChatRoomData: WritableSignal<ChatI | null> =
    this.chatsRoomService.currentChatRoomData

  ngOnInit (): void {
    this.chatsRoomService.usersLastSeenSocket()
    this.chatsRoomService.usersOnlineSocket()
    this.chatRoomMessagesService.newMessageSocket()
  }
}
