import { inject, Injectable, signal } from '@angular/core'
import { NotificationsSilencedEnum } from '../model'
import { ChatService } from './chat.service'

@Injectable({ providedIn: 'root' })
export class ChatOptionsService {
  private readonly chatService = inject(ChatService)

  private readonly currentIdNotificationsSilencedButton = signal<undefined | string>(
    undefined
  )

  public selectedMuteDuration = signal<NotificationsSilencedEnum | null>(
    NotificationsSilencedEnum.HOUR
  )

  public onClickArchivedButton (id: string) {
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

  public async onClickDeletedButton (id: string) {
    const newChats = this.chatService
      .chats()
      .filter((chat) => chat.id !== id)

    this.chatService.deleteChat(id, newChats)
  }

  public setShowChatOptions = (id?: string) => {
    this.chatService.chats.update((values) =>
      values.map((elem) => ({
        ...elem,
        showOptions: elem.id === id
      }))
    )
  }

  public onClickNotificationsSilencedButton (id: string) {
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

  public onSubmitNotificationsSilencedButton (id: string) {
    const newChats = this.chatService.chats().map((chat) => {
      if (chat.id !== this.currentIdNotificationsSilencedButton()) return chat
      return { ...chat, notificationsSilenced: this.selectedMuteDuration() }
    })

    this.chatService.updateChat(id, newChats, {
      notificationsSilenced: this.selectedMuteDuration()
    })
  }

  public onClickIsPinned (id: string) {
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

  public async onClickIsRead (id: string) {
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

  public async onClickIsBlocked (id: string) {
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

  public onClickInFavorites (id: string) {
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
}
