import {
  Component,
  HostListener,
  Input,
  OnChanges,
  signal
} from '@angular/core'
import { type ChatI } from '../../model'
import { ChatPreviewService } from './services/chat-preview.service'


@Component({
  selector: 'chat-preview',
  standalone: false,
  templateUrl: './chat-preview.component.html',
  providers: [ChatPreviewService],
  styles: ''
})

export class ChatPreviewComponent implements OnChanges {

  public chatPreviewOptionsCordenates
  public isInCard = signal(false)
  public messagesData

  @Input() public _chatPreviewData: ChatI | null = null

  constructor (private readonly chatPreviewService: ChatPreviewService) {
    this.messagesData = this.chatPreviewService.messagesData
    this.chatPreviewOptionsCordenates = this.chatPreviewService.chatPreviewOptionsCordenates

  }

  ngOnChanges (): void {
    this.chatPreviewService.updateData( this._chatPreviewData)
    this._chatPreviewData = this.chatPreviewService._chatPreviewData

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
