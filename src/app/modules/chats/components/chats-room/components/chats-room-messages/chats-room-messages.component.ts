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
  public messagesDataSelected =  this.chatRoomMessagesService.messagesDataSelected
  public showDeleteMessageModal = this.chatRoomMessagesService.showDeleteMessageModal
  dynamicColor = signal('#06cf9c')
  isChatRoomGroup = signal(false)
  showName = signal(false)
  isStarredMessage = signal(false)
  showCheckBox = this.chatRoomMessagesService.showCheckBox



  ngOnChanges (): void {
    if (this.messageData === null) return

    const messageOwnerId = this.messageData?.owner.id
    const currentUserId = this.userService.loginUserData()?.id
    const type = this.chatsRoomService.currentChatRoomData()?.type

    this.showName.set( messageOwnerId !== currentUserId && type === 'group' && this.messageData?.type === 'received')
    this.addColorToName(messageOwnerId)

    this.isChatRoomGroup.set(this.chatsRoomService.currentChatRoomData()?.type === 'group')

    const starredByUserId = this.messageData?.starredBy
    if (!starredByUserId || starredByUserId?.length) return
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
    return this.messagesDataSelected().some(messageSelected => messageSelected.id === messageId)
  }

  onCheckboxChange (event: any) {
    const isChecked = event.target.checked
    const messageData = this.messageData
    if (!messageData) return
    if (isChecked) {
      this.messagesDataSelected.update(prev => ([...prev,    { ownerId: messageData.owner.id, text: messageData.text, id: messageData.id }]))
      return
    }
    this.messagesDataSelected.update(prev => prev.filter(messagesSelected => messagesSelected.id !== messageData.id))
  }



}
