import { UtilsService } from './../../../../../../core/services/utils.service'
import { Component, signal } from '@angular/core'
import { ChatRoomMessagesService } from '../../services/chats-room-messages.service'
import { ChatsRoomService } from '../../services/chats-room.service'

@Component({
  selector: 'chats-room-footer',
  standalone: false,
  templateUrl: './chats-room-footer.component.html',
  styleUrl: './chats-room-footer.component.css'
})
export class ChatsRoomFooterComponent  {
  public textAreaValue = signal('')
  public pickerEmojyData = signal({
    width: 560,
    height: 549,
    x: 0,
    y: 450
  })

  constructor (
    private readonly chatRoomMessagesService: ChatRoomMessagesService,
    private readonly chatsRoomService: ChatsRoomService,
    private readonly utilsService: UtilsService
  ) {}


  openEmojiPicker (event: Event) {
    const coordenates = this.utilsService.getCoordinates(event as MouseEvent)
    this.pickerEmojyData.update(prev =>({ ...prev, x: coordenates.x - (prev.width / 2), y: coordenates.y - prev.height - 20  }))
  }

  autoExpand (event: Event): void {
    const textarea = event.target as HTMLTextAreaElement
    textarea.style.height = '40px'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  onInputChange (event: Event): void {
    const textarea = event.target as HTMLTextAreaElement
    this.chatsRoomService.handleUserIswriting()
    this.textAreaValue.set(textarea.value)
  }

  onEmojiChange (emoji: string) {
    this.textAreaValue.update(prev => prev + emoji)
  }

  onSubmit (event: Event) {
    event.preventDefault()
    const target = event.target as HTMLTextAreaElement
    this.chatRoomMessagesService.createMessage(target.value)
    this.textAreaValue.set('')
  }
}
