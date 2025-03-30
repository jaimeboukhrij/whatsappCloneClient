import { Component, inject, Input, signal } from '@angular/core';
import { ChatRoomI } from '../../model';
import { ChatOptionsService } from '../../services/chat-options.service';

@Component({
  selector: 'chat-preview-options',
  standalone: false,
  templateUrl: './chat-preview-options.component.html',
  styles: ``,
})
export class ChatPreviewOptionsComponent {
  private chatOptionsService = inject(ChatOptionsService);
  public chatPreviewOptions: { id: string; name: string }[] = [];

  public _chatPreviewData = signal<ChatRoomI | null>(null);

  @Input() showOption = false;

  @Input()
  set chatPreviewData(value: ChatRoomI) {
    this._chatPreviewData.set(value);
    this.chatPreviewOptions = [
      {
        id: 'isArchived',
        name: this._chatPreviewData()?.isArchived
          ? 'Desarchivar chat'
          : 'Archivar chat',
      },
      {
        id: 'notificationsSilenced',
        name: this._chatPreviewData()?.notificationsSilenced
          ? 'Desactivar silencio de notificaciones'
          : 'Silenciar notificaciones',
      },
      {
        id: 'isPinned',
        name: this._chatPreviewData()?.isPinned
          ? 'Desfijar chat'
          : 'Fijar chat',
      },
      {
        id: 'isRead',
        name: this._chatPreviewData()?.isRead
          ? 'Marcar como no leído'
          : 'Marcar como leído',
      },
      {
        id: 'inFavorites',
        name: this._chatPreviewData()?.inFavorites
          ? 'Eliminar de favoritos'
          : 'Añadir a favoritos',
      },
      {
        id: 'isBlocked',
        name: this._chatPreviewData()?.isBlocked ? 'Desbloquear' : 'Bloquear',
      },
      {
        id: 'deleteChat',
        name: 'Eliminar chat',
      },
    ];
  }

  public onClickOptions(id: string, event: MouseEvent) {
    event.stopPropagation();
    switch (id) {
      case 'isArchived':
        this.onClickArchivedButton();
        break;
      case 'deleteChat':
        this.onClickDeletedButton();
        break;
      case 'notificationsSilenced':
        this.onClickNotificationsSilencedButton();
        break;
      case 'isPinned':
        this.onClickIsPinned();
        break;
      case 'isRead':
        this.onClickIsRead();
        break;
      case 'inFavorites':
        this.onClickInFavorites();
        break;
      default:
        break;
    }
  }

  private onClickArchivedButton() {
    this.chatOptionsService.onClickArchivedButton(this._chatPreviewData()!.id);
  }

  private onClickDeletedButton() {
    this.chatOptionsService.onClickDeletedButton(this._chatPreviewData()!.id);
  }
  private onClickNotificationsSilencedButton() {
    this.chatOptionsService.setShowChatOptions();
    this.chatOptionsService.onClickNotificationsSilencedButton(
      this._chatPreviewData()!.id
    );
  }
  private onClickIsPinned() {
    this.chatOptionsService.onClickIsPinned(this._chatPreviewData()!.id);
  }
  private onClickIsRead() {
    this.chatOptionsService.onClickIsRead(this._chatPreviewData()!.id);
  }

  private onClickInFavorites() {
    this.chatOptionsService.onClickInFavorites(this._chatPreviewData()!.id);
  }
}
