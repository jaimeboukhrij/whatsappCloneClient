import {  ChatsRoomService } from './chats-room.service'
import { Injectable, signal,  WritableSignal } from '@angular/core'
import {  SocketStatusService } from '../../../core/services/socket/socket-status.service'
import {  ChatService } from '../../chats/services/chat.service'
import {  UserService } from '../../user/services/user.service'
import {
  ChatRoomMessageI,
  ChatRoomCreateMessageI
} from '../model/chat-room-messages.interface'
import { MessageApiService } from '../../../core/services/api/message-api.service'

@Injectable({ providedIn: 'root' })
export class ChatRoomMessagesService {
  chatRoomMessages: WritableSignal<ChatRoomMessageI[]> = signal([])
  lastTwentyMessages: WritableSignal<ChatRoomMessageI[]> = signal([])

  constructor (
    private readonly userService: UserService,
    private readonly chatsService: ChatService,
    private readonly socketStatusService: SocketStatusService,
    private readonly chatsRoomService: ChatsRoomService,
    private readonly messageApiServcice: MessageApiService
  ) {

  }


  getChatRoomMessages () {
    const currentChatRoomData = this.chatsRoomService.currentChatRoomData()

    if (!currentChatRoomData) return
    const messages = currentChatRoomData?.messages ?? []
    this.chatRoomMessages.set(messages)
    this.updateMessagesToRead(currentChatRoomData.id, messages)
  }

  private async updateMessagesToRead (chatRoomId: string, messages:  ChatRoomMessageI[]) {
    const updatedMessages = messages.map(message =>  ({ id: message.id, isRead: true }))
    this.messageApiServcice.updateMany(updatedMessages).subscribe({
      next: ()=>{ this.chatsService.getChats() },
      error: (err) => { console.log(err) }
    })

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



  private transformMessageData (messages: ChatRoomMessageI[]) {
    const userId = this.userService.loginUserData()?.id

    const updatedMessages = messages
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((message) => {
        return {
          ...message,
          type:
            userId === message?.owner?.id
              ? ('sent' as 'sent' | 'received')
              : ('received' as 'sent' | 'received')
        }
      })

    return updatedMessages
  }
}
