import { ChatI } from '../../interfaces'
import { Component, inject,  OnInit,  WritableSignal } from '@angular/core'
import { ChatsRoomService } from './services/chats-room.service'
import { ChatRoomMessagesService } from './components/chats-room-messages/services/chats-room-messages.service'

@Component({
  selector: 'app-chats-room',
  standalone: false,

  templateUrl: './chats-room.component.html',
  styleUrl: './chats-room.component.css'
})
export class ChatsRoomComponent implements OnInit {
  private readonly chatsRoomService = inject(ChatsRoomService)
  private readonly chatRoomMessagesService = inject(ChatRoomMessagesService)
  public currentChatRoomData: WritableSignal<ChatI | null> = this.chatsRoomService.currentChatRoomData
  isLoading = this.chatsRoomService.isLoading
  showForwardModal = this.chatsRoomService.showForwardModal



  ngOnInit (): void {
    this.chatsRoomService.usersOnlineSocket()
    this.chatsRoomService.usersWritingSocket()
    this.chatRoomMessagesService.newMessageSocket()
    this.chatRoomMessagesService.messageIsReadSocket()
    this.chatRoomMessagesService.deleteMessageSocker()
    this.chatsRoomService.newGroupSocket()
  }
}
