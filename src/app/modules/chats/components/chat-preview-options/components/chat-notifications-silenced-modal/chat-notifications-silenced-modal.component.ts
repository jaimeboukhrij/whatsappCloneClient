import { Component, inject, Input } from '@angular/core';
import { ChatService } from '../../../../services/chat.service';
import { ChatOptionsService } from '../../../../services/chat-options.service';
import { NotificationsSilencedEnum } from '../../../../model';

@Component({
  selector: 'chat-notifications-silenced-modal',
  standalone: false,

  templateUrl: './chat-notifications-silenced-modal.component.html',
  styles: ``,
})
export class ChatNotificationsSilencedModalComponent {
  private chatService = inject(ChatService);
  private chatOptionsService = inject(ChatOptionsService);
  public selectedMuteDuration = NotificationsSilencedEnum.HOUR;
  @Input() chatRoomId!: string;

  onSubmit(event: Event) {
    event.preventDefault();
    this.chatService.showSilencedNotificationsModal.update((prev) => ({
      ...prev,
      show: false,
    }));
    this.chatOptionsService.selectedMuteDuration.set(this.selectedMuteDuration);
    this.chatOptionsService.onSubmitNotificationsSilencedButton(
      this.chatRoomId
    );
  }

  onCancel() {
    this.chatService.showSilencedNotificationsModal.update((prev) => ({
      ...prev,
      show: false,
    }));
  }
}
