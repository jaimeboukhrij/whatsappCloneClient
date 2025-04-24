import { Component, inject } from '@angular/core'
import { ChatRoomMessagesService } from '../../services'

@Component({
  selector: 'app-chat-room-delete-message-modal',
  standalone: false,
  templateUrl: './chat-room-delete-message-modal.component.html',
  styles: ''
})
export class ChatRoomDeleteMessageModalComponent {

  private readonly chatRoomMessagesService = inject(ChatRoomMessagesService)

  onCancel () {
    this.chatRoomMessagesService.showDeleteMessageModal.set(false)
  }

  onDeleteMessage () {
    this.chatRoomMessagesService.OnDeleteMessages()
  }

  onDeleteMessageForMe () {
    this.chatRoomMessagesService.onDeleteMessageForMe()
  }
}
