import { Injectable, WritableSignal, effect, signal } from '@angular/core'
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs'
import { MessageApiService } from '../../../../../../../core/services/api/message-api.service'
import { SocketStatusService } from '../../../../../../../core/services/socket/socket-status.service'
import { UserService } from '../../../../../../user/services/user.service'
import { ChatI } from '../../../../../interfaces'
import { ChatRoomMessageI, ChatRoomCreateMessageI, ChatRoomUpdateMessageI } from '../../../interfaces/chat-room-messages.interface'
import { ChatService } from '../../../../../services/chats.service'
import { ChatsRoomService } from '../../../services/chats-room.service'
import { ChatStarredMessagesService } from '../../../../chats-starred-messages/services/chat-starred-messages.service'
import { ForwardUsersDataPreviewI } from '../components/chat-room-forward-modal/interface/chat-room-forward.interface'

interface messagesSelectedI {
  id: string
  text: string
  ownerId: string
  chatRoomId?: string
}

@Injectable({ providedIn: 'root' })
export class ChatRoomMessagesService {
  chatRoomMessages: WritableSignal<ChatRoomMessageI[]> = signal([])
  lastTwentyMessages: WritableSignal<ChatRoomMessageI[]> = signal([])
  currentChatRoomData: WritableSignal< ChatI | null> = signal(null)
  private readonly scrollBottomChatRoomSubject = new BehaviorSubject<boolean>(false)
  scrollBottomChatRoom$ = this.scrollBottomChatRoomSubject.asObservable()
  showDeleteMessageModal = signal(false)
  public currentMessagesOptionsId = signal<string | null>(null)
  public messageClickedIdToShowOptiones = signal<string | null>(null)
  public messagesDataSelected = signal<messagesSelectedI[]>([])
  public showCheckBox = signal(false)

  constructor (
    private readonly userService: UserService,
    private readonly chatsService: ChatService,
    private readonly socketStatusService: SocketStatusService,
    private readonly chatsRoomService: ChatsRoomService,
    private readonly messageApiServcice: MessageApiService,
    private readonly chatStarredMessagesService: ChatStarredMessagesService
  ) {
    this.currentChatRoomData = this.chatsRoomService.currentChatRoomData
    effect(()=>{
      const currentChatRoom = this.currentChatRoomData()
      this.getChatRoomMessages(currentChatRoom)
    })
  }

  onClickOption (optionId: string, messageData: ChatRoomMessageI) {
    this.currentMessagesOptionsId.set(optionId)
    this.showCheckBox.set(
      this.currentMessagesOptionsId() === 'remove' ||
      this.currentMessagesOptionsId() === 'forward'
    )
    switch (optionId) {
      case 'remove':
        this.removeMessage(messageData)
        break

      case 'standOut':
        this.standOutMessage(messageData)
        break

      case 'forward':
        this.forwardMessage()
        break

      default:
        break
    }
  }

  private removeMessage (messageData: ChatRoomMessageI) {

    this.messagesDataSelected.update(prev => ([...prev,
      { id: messageData.id, ownerId: messageData.owner.id, chatRoomId: messageData.chatRoomId, text: messageData.text }]))
  }

  private standOutMessage (messageData: ChatRoomMessageI) {
    const currentUser = this.userService.loginUserData()
    const currentUserId = currentUser?.id
    if (!currentUserId) return

    const isStarredMessage = messageData.starredBy!.some(user =>user.id === currentUserId)
    this.chatRoomMessages.update(prev =>{
      return prev.map(message => {
        if (message.id === messageData.id) {
          if (!isStarredMessage) {
            return ({ ...message, starredBy: [...message.starredBy!, currentUser] })
          } else {
            const updatedStarredMessages = message.starredBy!.filter(user => user.id !== currentUserId)
            message.starredBy = updatedStarredMessages.length ? updatedStarredMessages : null
            return ({ ...message, starredBy: updatedStarredMessages })
          }
        }
        return message
      })
    })
    this.updateManyMessages([{ id: messageData.id, starredByUserId: currentUserId }]).subscribe(
      {
        next: ()=>{
          this.chatStarredMessagesService.getUserStarredMessages()
        }
      }
    )
  }

  private forwardMessage () {}

  onSubmitForwardMessage (chatsSelected: ForwardUsersDataPreviewI[]) {
    const updatedMessagesData =  this.messagesDataSelected().map(({ ownerId, text }) => ({  ownerId, text }))
    chatsSelected.forEach(chat => {
      if (chat.chatRoomId) {
        this.createManyMessages(updatedMessagesData, chat.chatRoomId)
      }
    })
  }

  canDeleteMessages () {
    const messagesToDelete = this.messagesDataSelected()
      .map(({ id: messageIdToDelete }) => this.chatRoomMessages()
        .find(message => message.id === messageIdToDelete)
      )

    const messagesToDeleteOwnerId = messagesToDelete.map(message => message?.owner.id)

    const currentUserId = this.userService.loginUserData()?.id


    if (!currentUserId || !messagesToDelete.length) return false

    const areOwnerMesssagesToDelete =  messagesToDeleteOwnerId.every(messageOwnerIdToDelete => messageOwnerIdToDelete === currentUserId )
    const messagesHasMoreTan10Minutes = messagesToDelete.some(message => { message && this.isMoreThan10MinutesOld(message.date) })

    return areOwnerMesssagesToDelete && !messagesHasMoreTan10Minutes

  }

  private isMoreThan10MinutesOld (dateString: string): boolean {
    const date = new Date(dateString)
    const now = new Date()

    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = diffInMs / 1000 / 60

    return diffInMinutes > 10
  }

  getChatRoomMessages (currentChatRoom: ChatI | null) {
    if (!currentChatRoom) return
    const messages = currentChatRoom?.messages ?? []
    this.chatRoomMessages.set(messages)
  }

  async updateMessagesToRead ( messages:  ChatRoomMessageI[]) {
    const isMessageFromOtherUser = messages?.at(-1)?.owner.id !== this.userService.loginUserData()?.id
    if (!isMessageFromOtherUser ) return
    this.socketStatusService.emit('message-is-read-client', messages?.at(-1)?.owner.id)

    const updatedMessages = messages.map(message =>  ({ id: message.id, isRead: message.isDelivered }))
    this.updateManyMessages(updatedMessages).subscribe()
  }

  updateManyMessages ( messages:  ChatRoomUpdateMessageI[]) {
    return this.messageApiServcice.updateMany(messages).pipe(
      switchMap(() => this.chatsService.getChats()),
      catchError(error => {
        console.log(error)
        return of([])
      })
    )
  }

  onDeleteMessageForMe () {
    const currentUser = this.userService.loginUserData()
    const currentMessages = this.chatRoomMessages()
    if (!currentUser) return

    const messagesToHide = this.messagesDataSelected()
      .map(({ id: messageId }) =>{
        const currentMessage = currentMessages.find(mess => mess.id === messageId)!
        const currentMessageHideUsers = currentMessage?.hideFor ?? []
        currentMessageHideUsers.push(currentUser.id)
        return ({   id: messageId, hideFor: currentMessageHideUsers })
      })

    const messagesToHideIds = messagesToHide.map(messages => messages.id)

    const optimisticMessagesToShow = currentMessages.filter(message => !messagesToHideIds.includes(message.id) )

    this.chatRoomMessages.set(this.transformMessageData(optimisticMessagesToShow))


    this.updateManyMessages(messagesToHide)
      .subscribe({
        next: ()=>{
          this.currentMessagesOptionsId.set(null)
          this.showDeleteMessageModal.set(false)
          this.messagesDataSelected.set([])
        },
        error: () =>{
          this.chatRoomMessages.set(this.transformMessageData(currentMessages))
        }
      })

  }

  OnDeleteMessages () {
    const currentMessages = this.chatRoomMessages()

    const messagesIdsToDelete = this.messagesDataSelected().map(data => data.id)
    const currentUserId = this.userService.loginUserData()?.id
    if (!currentUserId) return

    const messagesToDelete = this.chatRoomMessages().filter(message => messagesIdsToDelete.includes(message.id))
    const areCurrentUserMessages = messagesToDelete.every(message => message.owner.id === currentUserId)
    if (!areCurrentUserMessages) return

    const optimisticMessagesToShow = currentMessages.filter(message => !messagesIdsToDelete.includes(message.id) )
    this.chatRoomMessages.set(this.transformMessageData(optimisticMessagesToShow))

    this.messageApiServcice.deleteMany(messagesIdsToDelete).subscribe({
      next: ()=>{
        this.socketStatusService.emit('on-delete-message-client', this.chatsRoomService.currentChatRoomId())

        this.currentMessagesOptionsId.set(null)
        this.showDeleteMessageModal.set(false)
        this.messagesDataSelected.set([])
      },
      error: ()=>{
        this.chatRoomMessages.set(this.transformMessageData(currentMessages))
      }
    })
  }

  private createManyMessages (messages: Array<{ text: string, ownerId: string }>, chatRoomId: string) {
    messages.forEach(({ text, ownerId }) => {
      if (!text) return
      const message: ChatRoomCreateMessageI = {
        text,
        ownerId,
        chatRoomId
      }
      this.socketStatusService.emit('message-from-client', message)
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

  deleteMessageSocker () {
    this.socketStatusService.on('on-delete-message-server', ()=>{
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
