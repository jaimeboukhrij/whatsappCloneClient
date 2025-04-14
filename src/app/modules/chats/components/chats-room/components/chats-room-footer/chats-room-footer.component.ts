import { Component, signal } from '@angular/core'
import { ChatRoomMessagesService } from '../../services/chats-room-messages.service'
import { ChatsRoomService } from '../../services/chats-room.service'

@Component({
  selector: 'chats-room-footer',
  standalone: false,
  templateUrl: './chats-room-footer.component.html',
  styleUrl: './chats-room-footer.component.css'
})
export class ChatsRoomFooterComponent {
  public textAreaValue = signal('')

  constructor (
    private readonly chatRoomMessagesService: ChatRoomMessagesService,
    private readonly chatsRoomService: ChatsRoomService
  ) {}


  autoExpand (event: Event): void {
    const textarea = event.target as HTMLTextAreaElement
    textarea.style.height = '40px'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  onInputChange (event: Event): void {
    const textarea = event.target as HTMLTextAreaElement
    this.chatsRoomService.handleUserIswriting()
    this.textAreaValue.set(textarea.value)
  }

  onSubmit (event: Event) {
    event.preventDefault()
    const target = event.target as HTMLTextAreaElement
    this.chatRoomMessagesService.createMessage(target.value)
    this.textAreaValue.set('')
  }
}
