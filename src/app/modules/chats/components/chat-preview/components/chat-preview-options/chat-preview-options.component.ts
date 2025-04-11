import { Component, Input, OnChanges } from '@angular/core'
import { ChatI } from '../../../../model'
import { ChatOptionsService } from '../../services/chat-preview-options.service'

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
    private readonly chatOptionsService: ChatOptionsService
  ) {
  }

  ngOnChanges (): void {
    this.chatOptionsService.updateChatPreviewData(this.chatPreviewData!)
    this.chatPreviewOptions = this.chatOptionsService.chatPreviewOptions

  }

  onClickOptions (id: string, event: MouseEvent) {
    const chatId = this.chatPreviewData?.id
    this.chatOptionsService.onClickOptions(id, event, chatId ?? '')
  }


}
