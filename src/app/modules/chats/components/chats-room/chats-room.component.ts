import { ChatI } from '../../interfaces'
import { Component, ElementRef, inject,  OnInit,  ViewChild,  WritableSignal } from '@angular/core'
import { ChatsRoomService } from './services/chats-room.service'
import { ChatRoomMessagesService } from './components/chats-room-messages/services/chats-room-messages.service'

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
  private shouldScroll = true


  @ViewChild('scrollContainer') private readonly scrollContainer!: ElementRef<HTMLDivElement>

  ngAfterViewChecked (): void {
    if (this.shouldScroll) {
      this.scrollToBottom()
    }
  }

  private scrollToBottom (): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
      this.shouldScroll = false
    }
  }

  ngOnInit (): void {
    this.chatsRoomService.usersOnlineSocket()
    this.chatsRoomService.usersWritingSocket()
    this.chatRoomMessagesService.newMessageSocket()
    this.chatRoomMessagesService.messageIsReadSocket()
    this.chatRoomMessagesService.deleteMessageSocker()
    this.chatsRoomService.newGroupSocket()

    this.chatRoomMessagesService.scrollBottomChatRoom$.subscribe((shouldScroll: boolean)=>{
      if (!shouldScroll) return
      this.shouldScroll = true
      this.scrollToBottom()
    })

  }
}
