import { Injectable, WritableSignal, signal } from '@angular/core'
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs'
import { MessageApiService } from '../../../../../../../core/services/api/message-api.service'
import { SocketStatusService } from '../../../../../../../core/services/socket/socket-status.service'
import { UserService } from '../../../../../../user/services/user.service'
import { ChatI } from '../../../../../model'
import { ChatRoomMessageI, ChatRoomCreateMessageI } from '../../../../../model/chat-room-messages.interface'
import { ChatService } from '../../../../../services/chats.service'
import { ChatsRoomService } from '../../../services/chats-room.service'

@Injectable({ providedIn: 'root' })
export class ChatRoomMessagesService {
  chatRoomMessages: WritableSignal<ChatRoomMessageI[]> = signal([])
  lastTwentyMessages: WritableSignal<ChatRoomMessageI[]> = signal([])
  currentChatRoomData: WritableSignal< ChatI | null> = signal(null)
  private readonly scrollBottomChatRoomSubject = new BehaviorSubject<boolean>(false)
  scrollBottomChatRoom$ = this.scrollBottomChatRoomSubject.asObservable()


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
    // this.updateMessagesToRead( messages)


  }



  async updateMessagesToRead ( messages:  ChatRoomMessageI[]) {
    const isMessageFromOtherUser = messages?.at(-1)?.owner.id !== this.userService.loginUserData()?.id
    if (!isMessageFromOtherUser ) return
    this.socketStatusService.emit('message-is-read-client', messages?.at(-1)?.owner.id)

    const updatedMessages = messages.map(message =>  ({ ...message, isRead: message.isDelivered }))
    this.updateManyMessages(updatedMessages).subscribe()
  }

  updateManyMessages ( messages:  ChatRoomMessageI[]) {
    return this.messageApiServcice.updateMany(messages).pipe(
      switchMap(() => this.chatsService.getChats()),
      catchError(error => {
        console.log(error)
        return of([])
      })
    )
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
        if (isMessageFromOtherUser && message.isDelivered) {
          this.updateMessagesToRead([message])
        }
      } else {
        this.chatsService.getChats().subscribe()
      }

      if (!isMessageFromOtherUser) {
        setTimeout(() => {
          this.scrollBottomChatRoomSubject.next(true)
        }, 0)
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
