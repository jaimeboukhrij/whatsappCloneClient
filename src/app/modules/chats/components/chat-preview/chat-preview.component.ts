import { Component, HostListener, inject, Input, signal } from '@angular/core';
import { ChatRoomI } from '../../model';
import { ChatOptionsService } from '../../services/chat-options.service';
import { UtilsService } from '../../../../core/services/utils.service';
import { ChatsRoomService } from '../../../chats-room/services/chats-room.service';
import { UserService } from '../../../user/services/user.service';

@Component({
  selector: 'chat-preview',
  standalone: false,
  templateUrl: './chat-preview.component.html',
  styles: ``,
})
export class ChatPreviewComponent {
  private chatOptionsService = inject(ChatOptionsService);
  private utilsService = inject(UtilsService);
  private chatsRoomService = inject(ChatsRoomService);
  private readonly userService = inject(UserService);
  public lastMessage = signal<string | null>(null);
  public lastMessageUser = signal<string | null>(null);
  public isUsermessage = signal(false);
  @Input()
  set chatPreviewData(value: ChatRoomI) {
    this._chatPreviewData.set(value);
    const lastMessage = value.messages.at(-1);
    this.lastMessage.set(lastMessage ? lastMessage.text : null);
    this.lastMessageUser.set(lastMessage ? lastMessage.owner.firstName : null);

    this.isUsermessage.set(
      this.userService.loginUserData()?.id === lastMessage?.owner.id
    );
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
    this.chatsRoomService.showChatRoomData(this._chatPreviewData()?.id || '');
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
