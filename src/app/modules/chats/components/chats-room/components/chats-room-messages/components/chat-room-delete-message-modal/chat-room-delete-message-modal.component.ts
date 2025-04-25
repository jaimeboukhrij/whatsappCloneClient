import { Component, inject, OnInit } from '@angular/core'
import { ChatRoomMessagesService } from '../../services'

@Component({
  selector: 'app-chat-room-delete-message-modal',
  standalone: false,
  templateUrl: './chat-room-delete-message-modal.component.html',
  styles: ''
})
export class ChatRoomDeleteMessageModalComponent implements OnInit {

  private readonly chatRoomMessagesService = inject(ChatRoomMessagesService)
  public canDeleteMessages: boolean = false

  ngOnInit (): void {
    this.canDeleteMessages = this.chatRoomMessagesService.canDeleteMessages()
  }


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
