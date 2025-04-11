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
import { UserService } from '../../../user/services/user.service'
import { ChatRoomMessageI } from '../../model/chat-room-messages.interface'
import { ChatsRoomService } from '../../services/chats-room.service'

interface MessagesDataI {
  lastMessage: string | null
  lastMessageUser: string | null
  isUserMessage: boolean
  lastTwentyMessage: ChatRoomMessageI[] | null
  messagesWithOutRead: number | null
  isRead: boolean
}
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
  public setShowChatOptions = this.chatOptionsService.setShowChatOptions
  public chatPreviewOptionsCordenates = signal({ x: 0, y: 0 })
  public isInCard = signal(false)

  public messagesData = signal<MessagesDataI>({
    lastMessage: null,
    lastMessageUser: null,
    isUserMessage: false,
    lastTwentyMessage: null,
    messagesWithOutRead: null,
    isRead: true
  })

  @Input() public _chatPreviewData: ChatI | null = null

  ngOnChanges (): void {
    this.updateMessagesData()
    // this._chatPreviewData!.isRead = this.messagesData().lastTwentyMessage?.some(message => message.isRead) ?? false
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

  private updateMessagesData () {

    const lastMessage = this._chatPreviewData!.messages.at(-1)
    const lastTwentyMessage = this._chatPreviewData!.messages.slice(-20)

    this.messagesData.update(prev => ({
      ...prev,
      lastMessage: lastMessage ? lastMessage.text : null,
      lastTwentyMessage,
      isUserMessage: this.userService.loginUserData()?.id === lastMessage?.owner.id,
      lastMessageUser: lastMessage ? lastMessage.owner.firstName : null,
      messagesWithOutRead: lastTwentyMessage.filter(message => !message.isRead).length,
      isRead: this._chatPreviewData?.isRead ?? false

    }))

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
    this.chatsRoomService.changeChatRoomData(this._chatPreviewData?.id ?? '')
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
