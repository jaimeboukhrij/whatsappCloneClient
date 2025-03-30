import { Component, HostListener, inject, Input, signal } from '@angular/core';
import { ChatRoomI } from '../../model';
import { ChatOptionsService } from '../../services/chat-options.service';
import { UtilsService } from '../../../../core/services/utils.service';

@Component({
  selector: 'chat-preview',
  standalone: false,
  templateUrl: './chat-preview.component.html',
  styles: ``,
})
export class ChatPreviewComponent {
  private chatOptionsService = inject(ChatOptionsService);
  private utilsService = inject(UtilsService);
  @Input()
  set chatPreviewData(value: ChatRoomI) {
    this._chatPreviewData.set(value);
  }

  public _chatPreviewData = signal<ChatRoomI | null>(null);
  public setShowChatOptions = this.chatOptionsService.setShowChatOptions;
  public chatPreviewOptionsCordenates = signal({ x: 0, y: 0 });
  public isInCard = signal(false);

  mouseEnter() {
    this.isInCard.set(true);
  }
  mouseLeave() {
    this.isInCard.set(false);
  }

  onShowOption(event?: Event, id?: string) {
    event?.stopImmediatePropagation();
    if (event)
      this.chatPreviewOptionsCordenates.set(this.getOptionsPosition(event));
    if (this._chatPreviewData()?.showOptions)
      this.setShowChatOptions(undefined);
    else this.setShowChatOptions(id);
  }

  private getOptionsPosition(event: Event) {
    const coordinates = this.utilsService.getCoordinates(event as MouseEvent);
    const optionsHeigth = 298;
    const isBelow = this.utilsService.checkIfElementIsBelow(
      event as MouseEvent,
      optionsHeigth
    );

    if (isBelow) coordinates.y = coordinates.y - 331;

    return coordinates;
  }

  onClickChatPreview() {
    if (!this._chatPreviewData()?.id || this._chatPreviewData()?.isRead) return;
    this.chatOptionsService.onClickIsRead(this._chatPreviewData()!.id);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.chat-options') &&
      this._chatPreviewData()?.showOptions
    ) {
      this.onShowOption();
    }
  }
}
