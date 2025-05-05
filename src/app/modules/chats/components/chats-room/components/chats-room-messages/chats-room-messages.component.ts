import { Component, inject, Input,  OnChanges, signal } from '@angular/core'
import { UserService } from '../../../../../user/services/user.service'
import { ChatRoomMessageI } from '../../interfaces/chat-room-messages.interface'
import { ChatsRoomService } from '../../services/chats-room.service'
import { ChatRoomMessagesService } from './services'

@Component({
  selector: 'chats-room-messages',
  standalone: false,

  templateUrl: './chats-room-messages.component.html',
  styleUrl: './chats-room-messages.component.css'
})
export class ChatsRoomMessagesComponent implements OnChanges {
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
  isStarredMessage = signal(false)



  ngOnChanges (): void {
    if (this.messageData === null) return
    const messageOwnerId = this.messageData?.owner.id
    const currentUserId = this.userService.loginUserData()?.id
    const type = this.chatsRoomService.currentChatRoomData()?.type

    this.showName.set( messageOwnerId !== currentUserId && type === 'group' && this.messageData?.type === 'received')
    this.addColorToName(messageOwnerId)

    this.isChatRoomGroup.set(this.chatsRoomService.currentChatRoomData()?.type === 'group')
    const starredByUserId = this.messageData?.starredBy
    if ( starredByUserId === null) return
    this.isStarredMessage.set(this.messageData.starredBy!.some(user =>user.id === currentUserId))
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
