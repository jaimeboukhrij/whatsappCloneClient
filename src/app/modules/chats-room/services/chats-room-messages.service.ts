import {  ChatsRoomService } from './chats-room.service'
import { Injectable, signal,  WritableSignal } from '@angular/core'
import {  SocketStatusService } from '../../../core/services/socket/socket-status.service'
import {  ChatService } from '../../chats/services/chat.service'
import {  UserService } from '../../user/services/user.service'
import {
  ChatRoomMessageI,
  ChatRoomCreateMessageI
} from '../interfaces/chat-room-messages.interface'

@Injectable({ providedIn: 'root' })
export class ChatRoomMessagesService {
  chatRoomMessages: WritableSignal<ChatRoomMessageI[]> = signal([])
  lastTwentyMessages: WritableSignal<ChatRoomMessageI[]> = signal([])

  constructor (
    private readonly userService: UserService,
    private readonly chatsService: ChatService,
    private readonly socketStatusService: SocketStatusService,
    private readonly chatsRoomService: ChatsRoomService
  ) {}

  private transformMessageData (messages: ChatRoomMessageI[]) {
    const userId = this.userService.loginUserData()?.id

    const updatedMessages = messages
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((message) => {
        return {
          ...message,
          isRead: true,
          type:
            userId === message.owner.id
              ? ('sent' as 'sent' | 'received')
              : ('received' as 'sent' | 'received')
        }
      })

    return updatedMessages
  }

  updateChatRoomMessage (messages: ChatRoomMessageI[]) {
    this.chatRoomMessages.set(this.transformMessageData(messages))
    const lastTwentyMessages = messages.slice(-20)
    this.lastTwentyMessages.set(lastTwentyMessages)

  }

  createMessage (text: string) {
    const message: ChatRoomCreateMessageI = {
      text,
      ownerId: this.userService.loginUserData()?.id ?? '',
      chatRoomId: this.chatsRoomService.currentChatRoomId()
    }
    this.socketStatusService.emit('message-from-client', message)
  }

  newMessageSocket () {
    this.socketStatusService.on('message-from-server', (message: ChatRoomMessageI) => {
      if (message) {
        this.chatRoomMessages.update((prev) => this.transformMessageData([...prev, message]))
        this.chatsService.getChats()
      }
    }
    )
  }
}
