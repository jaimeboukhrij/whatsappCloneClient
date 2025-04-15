import {  ChatsRoomService } from './chats-room.service'
import { Injectable, signal,  WritableSignal } from '@angular/core'
import {  SocketStatusService } from '../../../../../core/services/socket/socket-status.service'
import {  ChatService } from '../../../services/chats.service'
import {  UserService } from '../../../../user/services/user.service'
import {
  ChatRoomMessageI,
  ChatRoomCreateMessageI
} from '../../../model/chat-room-messages.interface'
import { MessageApiService } from '../../../../../core/services/api/message-api.service'
import { ChatI } from '../../../model'

@Injectable({ providedIn: 'root' })
export class ChatRoomMessagesService {
  chatRoomMessages: WritableSignal<ChatRoomMessageI[]> = signal([])
  lastTwentyMessages: WritableSignal<ChatRoomMessageI[]> = signal([])
  currentChatRoomData: WritableSignal< ChatI | null> = signal(null)


  constructor (
    private readonly userService: UserService,
    private readonly chatsService: ChatService,
    private readonly socketStatusService: SocketStatusService,
    private readonly chatsRoomService: ChatsRoomService,
    private readonly messageApiServcice: MessageApiService
  ) {

  }


  getChatRoomMessages () {
    this.currentChatRoomData.set(this.chatsRoomService.currentChatRoomData())
    const currentChatRoomData =  this.currentChatRoomData()
    if (!currentChatRoomData) return
    const messages = currentChatRoomData?.messages ?? []
    this.chatRoomMessages.set(messages)
    this.updateMessagesToRead( messages)


  }



  private async updateMessagesToRead ( messages:  ChatRoomMessageI[]) {
    const isMessageFromOtherUser = messages?.at(-1)?.owner.id !== this.userService.loginUserData()?.id

    if (!isMessageFromOtherUser) return
    this.socketStatusService.emit('message-is-read-client', messages?.at(-1)?.owner.id)

    const updatedMessages = messages.map(message =>  ({ id: message.id, isRead: true }))
    this.messageApiServcice.updateMany(updatedMessages).subscribe({
      next: ()=>{ this.chatsService.getChats().subscribe() },
      error: (err) => { console.log(err) }
    })
  }

  createMessage (text: string) {
    if (!text) return
    const message: ChatRoomCreateMessageI = {
      text,
      ownerId: this.userService.loginUserData()?.id ?? '',
      chatRoomId: this.chatsRoomService.currentChatRoomId()
    }

    this.socketStatusService.emit('message-from-client', message)
  }

  newMessageSocket () {
    this.socketStatusService.on('message-from-server', (message: ChatRoomMessageI) => {
      if (!message) return

      const currentChatRoomId = this.currentChatRoomData()?.id
      const isCurrentChatRoom = currentChatRoomId === message.chatRoomId
      const isMessageFromOtherUser = message.owner.id !== this.userService.loginUserData()?.id
      if (isCurrentChatRoom) {
        this.chatRoomMessages.update(prev => this.transformMessageData([...prev, message]))
        this.chatsService.getChats().subscribe()
        if (isMessageFromOtherUser) {
          this.updateMessagesToRead([message])
        }
      } else {

        this.chatsService.getChats().subscribe()
      }
    })
  }

  messageIsReadSocket () {
    this.socketStatusService.on('message-is-read-server', ()=>{
      this.chatRoomMessages.update(prevMess => {
        return prevMess.map(message => ({ ...message, isRead: true }))
      })

      this.chatsService.getChats().subscribe()

    })
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
