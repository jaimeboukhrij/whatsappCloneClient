import { Component, inject, Input } from '@angular/core'
import { ChatService } from '../../../../services/chat.service'
import { NotificationsSilencedEnum } from '../../../../model'
import { ChatPreviewOptionsService } from '../../services/chat-preview-options.service'

@Component({
  selector: 'chat-notifications-silenced-modal',
  standalone: false,

  templateUrl: './chat-notifications-silenced-modal.component.html',
  styles: ''
})
export class ChatNotificationsSilencedModalComponent {
  private readonly chatService = inject(ChatService)
  private readonly chatPreviewOptionsService = inject(ChatPreviewOptionsService)
  public selectedMuteDuration = NotificationsSilencedEnum.HOUR
  @Input() chatId!: string

  onSubmit (event: Event) {
    event.preventDefault()
    this.chatService.showSilencedNotificationsModal.update((prev) => ({
      ...prev,
      show: false
    }))
    this.chatPreviewOptionsService.selectedMuteDuration.set(this.selectedMuteDuration)
    this.chatPreviewOptionsService.onSubmitNotificationsSilencedButton(
      this.chatId
    )
  }

  onCancel () {
    this.chatService.showSilencedNotificationsModal.update((prev) => ({
      ...prev,
      show: false
    }))
  }
}
