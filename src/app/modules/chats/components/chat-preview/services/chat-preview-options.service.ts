import { inject, Injectable, signal } from '@angular/core'
import { ChatI, ChatPreviewFiltersEnum, NotificationsSilencedEnum } from '../../../model'
import { ChatService } from '../../../services/chats.service'
import { ChatsRoomService } from '../../chats-room/services/chats-room.service'
import { ChatFiltersService } from '../../../services/chats-filters.service'
import { UserService } from '../../../../user/services/user.service'
import { switchMap, tap } from 'rxjs'
import { ChatRoomMessagesService } from '../../chats-room/components/chats-room-messages/services/chats-room-messages.service'

@Injectable({ providedIn: 'root' })
export class ChatPreviewOptionsService {
  private readonly chatService = inject(ChatService)
  private readonly chatRoomService = inject(ChatsRoomService)
  private readonly chatFiltersService = inject(ChatFiltersService)
  private readonly chatRoomMessagesService = inject(ChatRoomMessagesService)
  private readonly userService = inject(UserService)

  private readonly currentIdNotificationsSilencedButton = signal<undefined | string>(
    undefined
  )

  private readonly chatPreviewData = signal<ChatI | null>(null)
  public chatPreviewOptions =  signal<Array<{ id: string, name: string }>>([])




  updateChatPreviewData (data: ChatI) {
    this.chatPreviewData.set(data)
    this.chatPreviewOptions.set([
      {
        id: 'isArchived',
        name: this.chatPreviewData()?.isArchived
          ? 'Desarchivar chat'
          : 'Archivar chat'
      },
      {
        id: 'notificationsSilenced',
        name: ((this.chatPreviewData()?.notificationsSilenced) != null)
          ? 'Desactivar silencio de notificaciones'
          : 'Silenciar notificaciones'
      },
      {
        id: 'isPinned',
        name: this.chatPreviewData()?.isPinned
          ? 'Desfijar chat'
          : 'Fijar chat'
      },
      {
        id: 'isRead',
        name: this.chatPreviewData()?.isRead
          ? 'Marcar como no leído'
          : 'Marcar como leído'
      },
      {
        id: 'inFavorites',
        name: this.chatPreviewData()?.inFavorites
          ? 'Eliminar de favoritos'
          : 'Añadir a favoritos'
      },
      {
        id: 'isBlocked',
        name: this.chatPreviewData()?.isBlocked ? 'Desbloquear' : 'Bloquear'
      },
      {
        id: 'deleteChat',
        name: 'Eliminar chat'
      },
      {
        id: 'leaveGroup',
        name: 'Salir del grupo'
      }
    ])


    if (data.isUserLastMessage ) {
      this.chatPreviewOptions.update(prev => prev.filter(options => options.id !== 'isRead'))
    }
    if (data.type === 'private') {
      this.chatPreviewOptions.update(prev => prev.filter(options => options.id !== 'leaveGroup' ))
      return
    }

    this.chatPreviewOptions.update(prev => prev.filter(options => options.id !== 'deleteChat' && options.id !== 'isBlocked'))
  }

  public async onClickOptions (id: string, event: MouseEvent, chatId: string) {

    event.stopPropagation()
    switch (id) {
      case 'isArchived':
        await this.onClickArchivedButton(chatId)
        break
      case 'deleteChat':
        this.onClickDeletedButton(chatId)
        break
      case 'notificationsSilenced':
        this.onClickNotificationsSilencedButton(chatId)
        break
      case 'isPinned':
        this.onClickIsPinned(chatId)
        break
      case 'isRead':
        this.onClickIsRead(chatId)
        break
      case 'inFavorites':
        await this.onClickInFavorites(chatId)
        break
      case 'isBlocked':
        this.onClickIsBlocked(chatId)
        break
      case 'leaveGroup':
        this.onClickLeaveGroup(chatId)
        break
      default:
        break
    }

  }



  readonly selectedMuteDuration = signal<NotificationsSilencedEnum | null>(
    NotificationsSilencedEnum.HOUR
  )



  private async onClickDeletedButton (id: string) {
    const newChats = this.chatService
      .chats()
      .filter((chat) => chat.id !== id)

    this.chatRoomService.changeChatRoomData('')
    this.chatRoomService.deleteChatRoom(id, newChats)
  }



  private onClickNotificationsSilencedButton (chatRoomId: string) {
    this.currentIdNotificationsSilencedButton.set(chatRoomId)
    const hasChatRoomNotificationsSilenced = this.chatService.chats().find((elem) => elem.id === chatRoomId)?.notificationsSilenced
    if (hasChatRoomNotificationsSilenced) {
      this.selectedMuteDuration.set(null)
      this.onSubmitNotificationsSilencedButton(chatRoomId)
      return
    }

    this.chatService.showSilencedNotificationsModal.update((prev) => ({
      chatId: chatRoomId ? chatRoomId : prev.chatId,
      show: !prev.show
    }))
  }






  async onClickIsRead (id: string) {
    const currentChat = this.chatService.chats().find(chat => chat.id === id)
    const messages = currentChat?.messages ?? []

    if (messages.some(message => !message.isRead)) {
      this.chatRoomMessagesService.updateMessagesToRead(messages)
      return
    }

    const currentUser = await this.userService.getUpdatedLoginUserData()
    const currentUserId =  currentUser?.id
    const messagesReverse = [...messages].reverse()
    const firstUnreadIndex = messagesReverse.findIndex(m => m.owner.id === currentUserId)
    const continuouslyReadMessages = messagesReverse.slice(0, firstUnreadIndex === -1 ? messages.length : firstUnreadIndex)
    const continuouslyReadMessagesUpdated = continuouslyReadMessages.map(messages => ({ ...messages, isRead: false }))

    this.chatRoomMessagesService.updateManyMessages(continuouslyReadMessagesUpdated).subscribe()





  }


  async onSubmitNotificationsSilencedButton (chatRoomId: string) {
    this.chatService.originalChats.update(prevChats => {
      return prevChats.map(chat =>
        chat.id === chatRoomId
          ? { ...chat, notificationsSilenced: this.selectedMuteDuration() ? this.selectedMuteDuration() : null }
          : chat
      )
    })
    this.chatFiltersService.filterChats(ChatPreviewFiltersEnum.ALL)

    const currentUser = await this.userService.getUpdatedLoginUserData()
    if (!currentUser?.id || !currentUser.chatsRoomArchived) return

    const notificationsSilencedChats =  currentUser.chatsRoomNotificationsSilenced
    const isSilenced = notificationsSilencedChats?.some(fav => fav.chatRoomId === chatRoomId)


    const notificationsSilencedChatsUpdated =  isSilenced
      ? notificationsSilencedChats.filter(fav => fav.chatRoomId !== chatRoomId)
      : [...notificationsSilencedChats, { chatRoomId, value: this.selectedMuteDuration()! }]


    this.userService.updateUser(currentUser.id, { chatsRoomNotificationsSilenced: notificationsSilencedChatsUpdated })
      .pipe(
        switchMap(() => this.chatService.getChats()),
        tap(() => { this.chatFiltersService.filterChats(ChatPreviewFiltersEnum.ALL) })
      )
      .subscribe()
  }


  private async onClickIsPinned (chatRoomId: string) {
    this.chatService.originalChats.update(prevChats => {
      return prevChats.map(chat =>
        chat.id === chatRoomId
          ? { ...chat, isPinned: chat.isPinned ? null : new Date() }
          : chat
      )
    })
    this.chatFiltersService.filterChats(ChatPreviewFiltersEnum.ALL)

    const currentUser = await this.userService.getUpdatedLoginUserData()
    if (!currentUser?.id || !currentUser.chatsRoomArchived) return

    const pinnedChats =  currentUser.chatsRoomPinned
    const isPinned = pinnedChats?.some(fav => fav.chatRoomId === chatRoomId)


    const updatedPinned =  isPinned
      ? pinnedChats.filter(fav => fav.chatRoomId !== chatRoomId)
      : [...pinnedChats, { chatRoomId, value: new Date() }]


    this.userService.updateUser(currentUser.id, { chatsRoomPinned: updatedPinned })
      .pipe(
        switchMap(() => this.chatService.getChats()),
        tap(() => { this.chatFiltersService.filterChats(ChatPreviewFiltersEnum.ALL) })
      )
      .subscribe()

  }


  private async onClickArchivedButton (chatRoomId: string) {
    const showArchivedChats = this.chatService.showArchivedChat()
    let filterToApply = !showArchivedChats ? ChatPreviewFiltersEnum.ALL : ChatPreviewFiltersEnum.ARCHIVED

    this.optimisticallyToggleProperty(chatRoomId, 'isArchived')
    const areArchivedChats = this.chatService.originalChats().some(chat => chat.isArchived)

    if (showArchivedChats && !areArchivedChats) {
      this.chatService.showArchivedChat.set(false)
      filterToApply = ChatPreviewFiltersEnum.ALL
    }

    this.chatFiltersService.filterChats(filterToApply)


    const currentUser = await this.userService.getUpdatedLoginUserData()
    if (!currentUser?.id || !currentUser.chatsRoomArchived) return

    const updatedArchived = this.getUpdatedList(currentUser.chatsRoomArchived, chatRoomId)

    this.userService.updateUser(currentUser.id, { chatsRoomArchived: updatedArchived })
      .pipe(
        switchMap(() => this.chatService.getChats()),
        tap(() => { this.chatFiltersService.filterChats(filterToApply) })
      )
      .subscribe()
  }

  private async onClickInFavorites (chatRoomId: string) {
    const showFavoritesChats = this.chatFiltersService.currentIdFilterChat() === ChatPreviewFiltersEnum.FAVORITE
    const filterToApply = !showFavoritesChats ? ChatPreviewFiltersEnum.ALL : ChatPreviewFiltersEnum.FAVORITE

    this.optimisticallyToggleProperty(chatRoomId, 'inFavorites')
    this.chatFiltersService.filterChats(filterToApply)

    const currentUser = await this.userService.getUpdatedLoginUserData()
    if (!currentUser?.id || !currentUser.chatsRoomFavorites) return

    const updatedFavorites = this.getUpdatedList(currentUser.chatsRoomFavorites, chatRoomId)

    this.userService.updateUser(currentUser.id, { chatsRoomFavorites: updatedFavorites })
      .pipe(
        switchMap(() => this.chatService.getChats()),
        tap(() => { this.chatFiltersService.filterChats(filterToApply) })
      )
      .subscribe()
  }

  private async onClickIsBlocked (chatRoomId: string) {
    const filterToApply = ChatPreviewFiltersEnum.ALL


    const currentUser = await this.userService.getUpdatedLoginUserData()
    if (!currentUser?.id || !currentUser.chatsRoomFavorites) return

    const updatedBlocked = this.getUpdatedList(currentUser.chatsRoomBlocked, chatRoomId)

    this.userService.updateUser(currentUser.id, { chatsRoomBlocked: updatedBlocked })
      .pipe(
        switchMap(() => this.chatService.getChats()),
        tap(() => { this.chatFiltersService.filterChats(filterToApply) })
      )
      .subscribe()
  }

  private optimisticallyToggleProperty<T extends keyof ChatI>(
    chatRoomId: string,
    property: T
  ) {
    this.chatService.originalChats.update(prevChats =>
      prevChats.map(chat => {
        if (chat.id !== chatRoomId) return chat

        const currentValue = chat[property]
        if (typeof currentValue === 'boolean') {
          return { ...chat, [property]: !currentValue }
        }

        return chat
      })
    )
  }



  private getUpdatedList<T extends { chatRoomId: string, value: boolean }>(
    list: T[],
    chatRoomId: string
  ): T[] {
    const exists = list.some(item => item.chatRoomId === chatRoomId)

    return exists
      ? list.filter(item => item.chatRoomId !== chatRoomId)
      : [...list, { chatRoomId, value: true } as T]
  }


  private onClickLeaveGroup (chatId: string) {
    this.chatService.showLeaveGroupModal.update((prev) => ({
      chatId: chatId ? chatId : prev.chatId,
      show: !prev.show
    }))
  }
}
