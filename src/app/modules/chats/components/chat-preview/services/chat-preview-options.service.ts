import { inject, Injectable, signal } from '@angular/core'
import { ChatI, NotificationsSilencedEnum } from '../../../model'
import { ChatService } from '../../../services/chat.service'
import { ChatsRoomService } from '../../../services/chats-room.service'

@Injectable({ providedIn: 'root' })
export class ChatPreviewOptionsService {
  private readonly chatService = inject(ChatService)
  private readonly chatRoomService = inject(ChatsRoomService)

  private readonly currentIdNotificationsSilencedButton = signal<undefined | string>(
    undefined
  )

  private readonly chatPreviewData = signal<ChatI | null>(null)
  public chatPreviewOptions: Array<{ id: string, name: string }> = []




  updateChatPreviewData (data: ChatI) {
    this.chatPreviewData.set(data)
    this.chatPreviewOptions = [
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
    ]

    if (data.type === 'private') {
      this.chatPreviewOptions = this.chatPreviewOptions.filter(options => options.id !== 'leaveGroup' )
      return

    }
    this.chatPreviewOptions = this.chatPreviewOptions.filter(options => options.id !== 'deleteChat' && options.id !== 'isBlocked')
  }

  public onClickOptions (id: string, event: MouseEvent, chatId: string) {
    event.stopPropagation()
    switch (id) {
      case 'isArchived':
        this.onClickArchivedButton(chatId)
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
        this.onClickInFavorites(chatId)
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

  public setShowChatOptions = (id?: string) => {
    this.chatService.chats.update((values) =>
      values.map((elem) => ({
        ...elem,
        showOptions: elem.id === id
      }))
    )
  }

  readonly selectedMuteDuration = signal<NotificationsSilencedEnum | null>(
    NotificationsSilencedEnum.HOUR
  )

  private onClickArchivedButton (id: string) {
    const prevChats = this.chatService.chats()
    const isChatArchived = prevChats.find(
      (chat) => chat.id === id
    )?.isArchived
    const newChats = prevChats
      .map((chat) => {
        if (chat.id !== id) return chat
        return { ...chat, isArchived: !chat.isArchived }
      })
      .filter((chat) =>
        this.chatService.showArchivedChat() ? chat.isArchived : !chat.isArchived
      )

    this.chatService.updateChat(id, newChats, {
      isArchived: !isChatArchived
    })
  }

  private async onClickDeletedButton (id: string) {
    const newChats = this.chatService
      .chats()
      .filter((chat) => chat.id !== id)

    this.chatRoomService.changeChatRoomData('')
    this.chatService.deleteChat(id, newChats)
  }



  private onClickNotificationsSilencedButton (id: string) {
    this.currentIdNotificationsSilencedButton.set(id)

    if (
      (this.chatService.chats().find((elem) => elem.id === id)
        ?.notificationsSilenced) != null
    ) {
      this.selectedMuteDuration.set(null)
      this.onSubmitNotificationsSilencedButton(id)
      return
    }
    this.chatService.showSilencedNotificationsModal.update((prev) => ({
      chatId: id ? id : prev.chatId,
      show: !prev.show
    }))
  }

  onSubmitNotificationsSilencedButton (id: string) {
    const newChats = this.chatService.chats().map((chat) => {
      if (chat.id !== this.currentIdNotificationsSilencedButton()) return chat
      return { ...chat, notificationsSilenced: this.selectedMuteDuration() }
    })

    this.chatService.updateChat(id, newChats, {
      notificationsSilenced: this.selectedMuteDuration()
    })
  }

  private onClickIsPinned (id: string) {
    const prevChats = this.chatService.chats()
    const isChatPinned = prevChats.find(
      (chat) => chat.id === id
    )?.isPinned
    const newChats = this.chatService.chats().map((chat) => {
      if (chat.id !== id) return chat
      return {
        ...chat,
        isPinned: chat.isPinned ? null : new Date()
      }
    })
    const sortedChats = this.chatService.sortChats(newChats)
    this.chatService.updateChat(
      id,
      sortedChats,
      { isPinned: isChatPinned ? null : new Date() }
    )
  }

  async onClickIsRead (id: string) {
    const prevChats = this.chatService.chats()
    const isChatRead = prevChats.find((chat) => chat.id === id)?.isRead
    const newChats = prevChats.map((chat) => {
      if (chat.id !== id) return chat
      return {
        ...chat,
        isRead: !chat.isRead
      }
    })

    this.chatService.updateChat(id, newChats, {
      isRead: !isChatRead
    })
  }

  private async onClickIsBlocked (id: string) {
    const prevChats = this.chatService.chats()
    const isChatBlocked = prevChats.find(
      (chat) => chat.id === id
    )?.isBlocked
    const newChats = prevChats.map((chat) => {
      if (chat.id !== id) return chat
      return {
        ...chat,
        isBlocked: !chat.isBlocked
      }
    })

    this.chatService.updateChat(id, newChats, {
      isBlocked: !isChatBlocked
    })
  }

  private onClickInFavorites (id: string) {
    const prevChats = this.chatService.chats()

    const isChatInFavorites = prevChats.find(
      (chat) => chat.id === id
    )?.inFavorites
    const newChats = prevChats.map((chat) => {
      if (chat.id !== id) return chat
      return {
        ...chat,
        inFavorites: !chat.inFavorites
      }
    })

    this.chatService.updateChat(id, newChats, {
      inFavorites: !isChatInFavorites
    })
  }

  private onClickLeaveGroup (chatId: string) {
    this.chatService.showLeaveGroupModal.update((prev) => ({
      chatId: chatId ? chatId : prev.chatId,
      show: !prev.show
    }))
  }
}
