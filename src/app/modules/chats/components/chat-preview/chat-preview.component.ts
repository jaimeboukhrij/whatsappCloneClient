import {
  Component,
  HostListener,
  Input,
  OnChanges,
  signal,
  SimpleChanges
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

export class ChatPreviewComponent implements OnChanges {

  public chatPreviewOptionsCordenates
  public isInCard = signal(false)
  public messagesData
  public chatPreviewOptions: Array<{ id: string, name: string }> = []
  public startAnimation

  @Input() public _chatPreviewData: ChatI | null = null

  constructor (private readonly chatPreviewService: ChatPreviewService,
    private readonly chatPreviewOptionsService: ChatPreviewOptionsService

  ) {
    this.messagesData = this.chatPreviewService.messagesData
    this.chatPreviewOptionsCordenates = this.chatPreviewService.chatPreviewOptionsCordenates
    this.startAnimation = this.chatPreviewService.startAnimation
  }

  ngOnChanges (changes: SimpleChanges): void {
    if (changes['_chatPreviewData']) {
      this.chatPreviewService.updateData(this._chatPreviewData)
      this._chatPreviewData = this.chatPreviewService._chatPreviewData
      this.chatPreviewOptions = this.chatPreviewOptionsService.chatPreviewOptions
      this.chatPreviewOptionsService.updateChatPreviewData(this._chatPreviewData!)
      console.log('changes ^^^^')
    }
  }

  async onClickOption (data: { id: string, event: MouseEvent }) {
    const { id, event } = data
    const chatId = this._chatPreviewData?.id
    await this.chatPreviewOptionsService.onClickOptions(id, event, chatId ?? '')
  }



  mouseEnter () {
    this.isInCard.set(true)
  }

  mouseLeave () {
    this.isInCard.set(false)
  }

  onShowOption (event?: Event, id?: string) {
    this.chatPreviewService.onShowOption(event, id)
  }

  onClickChatPreview () {
    this.chatPreviewService.onClickChatPreview()
  }

  @HostListener('document:click', ['$event'])
  onClickOutside (event: Event) {
    if (!this._chatPreviewData?.showOptions) return
    this.chatPreviewService.onClickOutside(event)
  }
}
