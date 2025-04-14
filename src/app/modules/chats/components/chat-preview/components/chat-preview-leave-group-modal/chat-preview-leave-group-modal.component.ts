import { Component, inject, Input } from '@angular/core'
import { ChatI, NotificationsSilencedEnum } from '../../../../model'
import { ChatService } from '../../../../services/chat.service'
import { ChatPreviewService } from '../../services/chat-preview.service'

@Component({
  selector: 'chat-preview-leave-group-modal',
  standalone: false,
  templateUrl: './chat-preview-leave-group-modal.component.html',
  providers: [ChatPreviewService],
  styles: ''
})
export class ChatPreviewLeaveGroupModalComponent {
  private readonly chatService = inject(ChatService)
  private readonly chatPreviewService = inject(ChatPreviewService)
  public selectedMuteDuration = NotificationsSilencedEnum.HOUR
  private _chatId: string = ''
  public currentChatPreviwData: ChatI | null = null

  @Input() set chatId (value: string) {
    if (!value) return
    this._chatId = value
    const currentChat = this.chatService.chats().find(chat => chat.id === value)
    if (!currentChat) return
    this.currentChatPreviwData = currentChat
  }

  onCancel () {
    this.chatPreviewService.onCancelLeaveGroupModal(this._chatId)
  }

  onLeaveGroup () {
    this.chatPreviewService.leaveGroup(this._chatId)
  }
}
