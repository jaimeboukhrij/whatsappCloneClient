import {
  Component,
  HostListener,
  inject,
  Input,
  OnChanges,
  signal
} from '@angular/core'
import { type ChatI } from '../../model'
import { ChatOptionsService } from '../../services/chat-options.service'
import { UtilsService } from '../../../../core/services/utils.service'
import { ChatsRoomService } from '../../../chats-room/services/chats-room.service'
import { UserService } from '../../../user/services/user.service'
import { ChatService } from '../../services/chat.service'

@Component({
  selector: 'chat-preview',
  standalone: false,
  templateUrl: './chat-preview.component.html',
  styles: ''
})
export class ChatPreviewComponent implements OnChanges {
  private readonly chatOptionsService = inject(ChatOptionsService)
  private readonly utilsService = inject(UtilsService)
  private readonly chatsRoomService = inject(ChatsRoomService)
  private readonly userService = inject(UserService)
  private readonly chatService = inject(ChatService)

  public lastMessage = signal<string | null>(null)
  public lastMessageUser = signal<string | null>(null)
  public isUsermessage = signal(false)
  public setShowChatOptions = this.chatOptionsService.setShowChatOptions
  public chatPreviewOptionsCordenates = signal({ x: 0, y: 0 })
  public isInCard = signal(false)

  @Input() public _chatPreviewData: ChatI | null = null

  ngOnChanges (): void {
    const lastMessage = this._chatPreviewData!.messages.at(-1)
    this.lastMessage.set(lastMessage ? lastMessage.text : null)
    this.lastMessageUser.set(lastMessage ? lastMessage.owner.firstName : null)

    this.isUsermessage.set(
      this.userService.loginUserData()?.id === lastMessage?.owner.id
    )
  }

  mouseEnter () {
    this.isInCard.set(true)
  }

  mouseLeave () {
    this.isInCard.set(false)
  }

  onShowOption (event?: Event, id?: string) {
    event?.stopImmediatePropagation()
    if (event)
      this.chatPreviewOptionsCordenates.set(this.getOptionsPosition(event))
    if (this._chatPreviewData?.showOptions) this.setShowChatOptions(undefined)
    else this.setShowChatOptions(id)
  }

  private getOptionsPosition (event: Event) {
    const coordinates = this.utilsService.getCoordinates(event as MouseEvent)
    const optionsHeigth = 298
    const isBelow = this.utilsService.checkIfElementIsBelow(
      event as MouseEvent,
      optionsHeigth
    )

    if (isBelow) coordinates.y = coordinates.y - 331

    return coordinates
  }

  onClickChatPreview () {
    this.chatsRoomService.showChatRoomData(this._chatPreviewData?.id ?? '')
    if (!this._chatPreviewData?.id || this._chatPreviewData?.isRead) return
    this.chatOptionsService.onClickIsRead(this._chatPreviewData.id)
  }

  @HostListener('document:click', ['$event'])
  onClickOutside (event: Event) {
    const target = event.target as HTMLElement
    if (
      !target.closest('.chat-options') &&
      this._chatPreviewData?.showOptions
    ) {
      this.onShowOption()
    }
  }
}
