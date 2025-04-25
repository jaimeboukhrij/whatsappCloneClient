import {
  Component,
  HostListener,
  Input,
  signal
} from '@angular/core'
import { type ChatI } from '../../model'
import { ChatPreviewService } from './services/chat-preview.service'
import { ChatPreviewOptionsService } from './services/chat-preview-options.service'


@Component({
  selector: 'chat-preview',
  standalone: false,
  templateUrl: './chat-preview.component.html',
  providers: [ChatPreviewService],
  styleUrl: './chat-preview.component.css'
})

export class ChatPreviewComponent {

  public chatPreviewOptionsCordenates
  public isInCard = signal(false)
  public messagesData
  public chatPreviewOptions
  public startAnimation
  public _chatPreviewData =  signal<ChatI | null>(null)
  public showOptions = signal(false)
  public chatClickedToShowOptionsId = signal<string | null>(null)

  @Input() set chatPreviewData (data: ChatI) {
    this._chatPreviewData.set(data)
    this.chatPreviewService.updateMessagesData(data)
  }

  constructor (private readonly chatPreviewService: ChatPreviewService,
    private readonly chatPreviewOptionsService: ChatPreviewOptionsService

  ) {
    this.messagesData = this.chatPreviewService.messagesData
    this.chatPreviewOptionsCordenates = this.chatPreviewService.chatPreviewOptionsCordenates
    this.startAnimation = this.chatPreviewService.startAnimation
    this.chatPreviewOptions = this.chatPreviewOptionsService.chatPreviewOptions
    this.chatClickedToShowOptionsId = this.chatPreviewOptionsService.chatClickedToShowOptionsId
  }



  async onClickOption (data: { id: string, event: MouseEvent }) {
    const { id, event } = data
    this.chatPreviewOptionsService.chatClickedToShowOptionsId.set(null)

    const chatId = this._chatPreviewData()?.id
    await this.chatPreviewOptionsService.onClickOptions(id, event, chatId ?? '')
  }



  mouseEnter () {
    this.isInCard.set(true)
  }

  mouseLeave () {
    this.isInCard.set(false)
  }

  onShowOption (event: Event, selectedChatId: string) {
    event.stopImmediatePropagation()

    this.chatPreviewOptionsCordenates.set(this.chatPreviewService.getOptionsPosition(event))
    const currentChatId = this._chatPreviewData()!.id
    const currentSelectedChatid =  this.chatPreviewOptionsService.chatClickedToShowOptionsId()

    if (currentChatId === currentSelectedChatid) {
      this.chatPreviewOptionsService.chatClickedToShowOptionsId.set(null)
      return
    }
    this.chatPreviewOptionsService.updateChatPreviewData(this._chatPreviewData()!)

    this.chatPreviewOptionsService.chatClickedToShowOptionsId.set(selectedChatId)
  }

  onClickChatPreview () {
    this.chatPreviewService.changeChatRoomData(this._chatPreviewData()?.id ?? '')
    if (!this._chatPreviewData()?.id || this._chatPreviewData()?.isRead) return
    this.chatPreviewOptionsService.onClickIsRead(this._chatPreviewData()!.id)
  }


  @HostListener('document:click', ['$event'])
  onClickOutside (event: Event) {
    if (!this.chatPreviewOptionsService.chatClickedToShowOptionsId()) return
    const target = event.target as HTMLElement

    if (!target.closest('.chat-options') ) {
      this.chatPreviewOptionsService.chatClickedToShowOptionsId.set(null)

    }
  }

}


