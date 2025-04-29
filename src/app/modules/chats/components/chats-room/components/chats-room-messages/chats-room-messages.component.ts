import { Component, inject, Input,  OnInit, signal } from '@angular/core'
import { UserService } from '../../../../../user/services/user.service'
import { ChatRoomMessageI } from '../../../../model/chat-room-messages.interface'
import { ChatsRoomService } from '../../services/chats-room.service'
import { ChatRoomMessagesService } from './services'

@Component({
  selector: 'chats-room-messages',
  standalone: false,

  templateUrl: './chats-room-messages.component.html',
  styleUrl: './chats-room-messages.component.css'
})
export class ChatsRoomMessagesComponent implements OnInit {
  private readonly userService = inject(UserService)
  private readonly chatsRoomService = inject(ChatsRoomService)
  private readonly chatRoomMessagesService = inject(ChatRoomMessagesService)

  @Input() messageData: ChatRoomMessageI | null = null
  @Input() typeChatRoom = ''

  public showChatRoomMessageButtonOptions = signal(false)
  public currentMessagesOptionsId = this.chatRoomMessagesService.currentMessagesOptionsId
  public messagesIdsSelectedToDelete =  this.chatRoomMessagesService.messagesIdsSelectedToDelete
  public showDeleteMessageModal = this.chatRoomMessagesService.showDeleteMessageModal




  dynamicColor = signal('#06cf9c')
  isChatRoomGroup = signal(false)
  showName = signal(false)

  ngOnInit (): void {
    const messageOwnerId = this.messageData?.owner.id
    const currentUserId = this.userService.loginUserData()?.id
    const type = this.chatsRoomService.currentChatRoomData()?.type

    this.showName.set( messageOwnerId !== currentUserId && type === 'group' && this.messageData?.type === 'received')
    this.addColorToName(messageOwnerId!)
    this.isChatRoomGroup.set(this.chatsRoomService.currentChatRoomData()?.type === 'group')
  }

  onMouseEnter () {
    if (this.chatRoomMessagesService.messageClickedIdToShowOptiones()) return
    this.showChatRoomMessageButtonOptions.set(true)
  }

  onMouseLeave () {
    if (this.chatRoomMessagesService.messageClickedIdToShowOptiones()) return
    this.showChatRoomMessageButtonOptions.set(false)
  }

  private addColorToName (messageOwnerId: string) {
    const colors = this.chatsRoomService.nameColors()
    const newColor =  colors?.get(messageOwnerId) ?? '#06cf9c'
    this.dynamicColor.set(newColor)
  }

  isChecked () {
    const messageId = this.messageData?.id
    if (!messageId) return
    return this.messagesIdsSelectedToDelete().includes(messageId)
  }

  onCheckboxChange (event: any) {
    const isChecked = event.target.checked
    const messageId = this.messageData?.id
    if (!messageId) return
    if (isChecked) {
      this.messagesIdsSelectedToDelete.update(prev => ([...prev, messageId]))
      return
    }
    this.messagesIdsSelectedToDelete.update(prev => prev.filter(id => id !== messageId))
  }



}
