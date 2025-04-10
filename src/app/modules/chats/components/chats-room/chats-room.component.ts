import { ChatI } from '../../model'
import { ChatRoomMessagesService } from '../../services/chats-room-messages.service'
import { ChatsRoomService } from '../../services/chats-room.service'
import { Component, ElementRef, inject,  OnInit,  ViewChild,  WritableSignal } from '@angular/core'

@Component({
  selector: 'app-chats-room',
  standalone: false,

  templateUrl: './chats-room.component.html',
  styles: ''
})
export class ChatsRoomComponent implements OnInit {
  private readonly chatsRoomService = inject(ChatsRoomService)
  private readonly chatRoomMessagesService = inject(ChatRoomMessagesService)
  public currentChatRoomData: WritableSignal<ChatI | null> = this.chatsRoomService.currentChatRoomData
  isLoading = this.chatsRoomService.isLoading

  @ViewChild('scrollContainer') private readonly scrollContainer!: ElementRef<HTMLDivElement>

  ngAfterViewChecked (): void {
    this.scrollToBottom()
  }

  private scrollToBottom (): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
    }
  }

  ngOnInit (): void {
    this.chatsRoomService.usersOnlineSocket()
    this.chatsRoomService.usersWritingSocket()
    this.chatRoomMessagesService.newMessageSocket()
    this.chatRoomMessagesService.messageIsReadSocket()
  }
}
