import { Component, inject, Input,  OnInit, signal } from '@angular/core'
import { UserService } from '../../../../../user/services/user.service'
import { ChatRoomMessageI } from '../../../../model/chat-room-messages.interface'
import { ChatsRoomService } from '../../services/chats-room.service'

@Component({
  selector: 'chats-room-messages',
  standalone: false,

  templateUrl: './chats-room-messages.component.html',
  styleUrl: './chats-room-messages.component.css'
})
export class ChatsRoomMessagesComponent implements OnInit {
  private readonly userService = inject(UserService)
  private readonly chatsRoomService = inject(ChatsRoomService)

  @Input() messageData: ChatRoomMessageI | null = null
  @Input() typeChatRoom = ''
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

  private addColorToName (messageOwnerId: string) {
    const colors = this.chatsRoomService.nameColors()
    const newColor =  colors?.get(messageOwnerId) ?? '#06cf9c'
    this.dynamicColor.set(newColor)
  }
}
