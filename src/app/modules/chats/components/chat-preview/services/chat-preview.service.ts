import { inject, signal } from '@angular/core'
import { UtilsService } from '../../../../../core/services/utils.service'
import { UserService } from '../../../../user/services/user.service'
import { MessagesDataI, ChatI } from '../../../model'
import { ChatsRoomService } from '../../../services/chats-room.service'
import { ChatPreviewOptionsService } from './chat-preview-options.service'
import { ChatRoomMessageI } from '../../../model/chat-room-messages.interface'
import { ChatService } from '../../../services/chat.service'

export class ChatPreviewService {
  private readonly chatPreviewOptionsService = inject(ChatPreviewOptionsService)
  private readonly utilsService = inject(UtilsService)
  private readonly chatsRoomService = inject(ChatsRoomService)
  private readonly userService = inject(UserService)
  private readonly chatService = inject(ChatService)
  public chatPreviewOptionsCordenates = signal({ x: 0, y: 0 })
  public isInCard = signal(false)

  public _chatPreviewData: ChatI | null = null

  public messagesData = signal<MessagesDataI>({
    lastMessage: null,
    lastMessageUser: null,
    isUserMessage: false,
    lastTwentyMessage: null,
    messagesWithOutRead: null,
    isRead: true
  })


  getChatPreviewData () {
    return this._chatPreviewData
  }

  updateData (newChatPreviewData: ChatI | null) {
    if (!newChatPreviewData) return
    this._chatPreviewData = newChatPreviewData
    const messages = newChatPreviewData.messages
    this.updateMessagesData(messages)
  }


  mouseEnter () {
    this.isInCard.set(true)
  }

  mouseLeave () {
    this.isInCard.set(false)
  }

  onShowOption (event?: Event, id?: string) {
    event?.stopImmediatePropagation()
    if (event) this.chatPreviewOptionsCordenates.set(this.getOptionsPosition(event))
    if (this._chatPreviewData?.showOptions) {
      this.chatPreviewOptionsService.setShowChatOptions(undefined)
    } else this.chatPreviewOptionsService.setShowChatOptions(id)
  }

  updateMessagesData (messages: ChatRoomMessageI[]) {
    const lastMessage = messages.at(-1)
    const lastTwentyMessage = messages.slice(-20)
    const logedUserAndMessageOwnerAreThesame = this.userService.loginUserData()?.id === lastMessage?.owner.id
    const lastMessageUser = logedUserAndMessageOwnerAreThesame
      ? 'Tu'
      : lastMessage?.owner.firstName ?? null


    this.messagesData.set({
      lastMessage: lastMessage ? lastMessage.text : null,
      lastTwentyMessage,
      isUserMessage: this.userService.loginUserData()?.id === lastMessage?.owner.id,
      lastMessageUser,
      messagesWithOutRead: lastTwentyMessage.filter(message => !message.isRead).length,
      isRead: this._chatPreviewData?.isRead ?? false

    })

  }

  private getOptionsPosition (event: Event) {
    const coordinates = this.utilsService.getCoordinates(event as MouseEvent)
    const optionsHeigth = 298
    const isBelow = this.utilsService.checkIfElementIsBelow(
      event as MouseEvent,
      optionsHeigth
    )
    if (isBelow) coordinates.y = coordinates.y - 331

    return coordinates
  }

  onClickChatPreview () {
    this.chatsRoomService.changeChatRoomData(this._chatPreviewData?.id ?? '')
    if (!this._chatPreviewData?.id || this._chatPreviewData?.isRead) return
    this.chatPreviewOptionsService.onClickIsRead(this._chatPreviewData.id)
  }



  onClickOutside (event: Event) {
    if (!this._chatPreviewData?.showOptions) return
    const target = event.target as HTMLElement

    if (
      !target.closest('.chat-options') &&
      this._chatPreviewData?.showOptions
    ) {
      this.onShowOption()
    }
  }

  onCancelLeaveGroupModal (chatId: string) {
    this.chatService.showLeaveGroupModal.update((prev) => ({
      chatId,
      show: false
    }))
  }

  leaveGroup (chatId: string) {

  }



}
