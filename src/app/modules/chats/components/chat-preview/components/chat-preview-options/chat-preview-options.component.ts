import { Component, Input, OnChanges } from '@angular/core'
import { ChatI } from '../../../../model'
import { ChatPreviewOptionsService } from '../../services/chat-preview-options.service'

@Component({
  selector: 'chat-preview-options',
  standalone: false,
  templateUrl: './chat-preview-options.component.html',
  styles: ''
})
export class ChatPreviewOptionsComponent implements OnChanges {
  public chatPreviewOptions: Array<{ id: string, name: string }> = []

  @Input() showOption = false
  @Input() chatPreviewData: ChatI | null = null

  constructor (
    private readonly chatPreviewOptionsService: ChatPreviewOptionsService
  ) {
  }

  ngOnChanges (): void {
    this.chatPreviewOptionsService.updateChatPreviewData(this.chatPreviewData!)
    this.chatPreviewOptions = this.chatPreviewOptionsService.chatPreviewOptions

  }

  onClickOptions (id: string, event: MouseEvent) {
    const chatId = this.chatPreviewData?.id
    this.chatPreviewOptionsService.onClickOptions(id, event, chatId ?? '')
  }


}
