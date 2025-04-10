import { inject, Injectable, signal,  WritableSignal } from '@angular/core'
import { ChatI } from '../model'
import { map } from 'rxjs'
import { ChatApiService, ChatRoomApiService, UserApiService } from '../../../core/services/api'

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly userApiService = inject(UserApiService)
  private readonly chatApiServie = inject(ChatApiService)
  private readonly chatRoomApiServie = inject(ChatRoomApiService)

  public showArchivedChat = signal(false)
  public showSilencedNotificationsModal = signal({
    chatId: '',
    show: false
  })

  public originalChats: WritableSignal<ChatI[]> = signal([])
  public chats: WritableSignal<ChatI[]> = signal([])

  public getChats (updateChats = true) {
    this.userApiService
      .getUserChats()
      .pipe(map((chats) => this.sortChats(chats)))
      .subscribe({
        next: (data) => {
          console.log(data)
          const chatsVisibles = data.filter((chat) => !chat.isArchived)
          if (updateChats) this.chats.set(chatsVisibles)
          this.originalChats.set(data)
        },
        error (err) {
          console.log(err)
        }
      })
  }

  public resetToOriginalChats () {
    this.chats.set(
      this.originalChats().filter((chats) => !chats.isArchived)
    )
  }

  public async deleteChat (id: string, newChats: ChatI[]) {
    const prevChats = this.chats()
    this.chats.set(newChats)

    this.chatApiServie.deleteChat(id).subscribe({
      next: () => { this.getChats(false) },
      error: (error) => {
        this.chats.set(prevChats)
        console.log(error)
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public updateChat (id: string, newChats: ChatI[], data: Partial<ChatI>) {
    const prevChats = this.chats()
    this.chats.set(newChats)

    this.chatRoomApiServie.updateChatRoom(id, data).subscribe({
      next: () => { this.getChats(false) },
      error: (error) => {
        this.chats.set(prevChats)
        console.log(error)
      }
    })
  }

  getArchivedChats () {
    const archivedChats = this.chats().filter((chat) => chat.isArchived)
    return archivedChats
  }

  sortChats (newChats: ChatI[]) {
    return [...newChats].sort((a, b) => {
      const isPinnedA = a.isPinned ? new Date(a.isPinned).getTime() : 0
      const isPinnedB = b.isPinned ? new Date(b.isPinned).getTime() : 0

      if (isPinnedA && !isPinnedB) return -1
      if (!isPinnedA && isPinnedB) return 1
      if (isPinnedA && isPinnedB) return isPinnedB - isPinnedA

      const lastMessageTimeA = a.lastChatMessageHour
        ? new Date(a.lastChatMessageHour).getTime()
        : new Date(a.createdAt).getTime()

      const lastMessageTimeB = b.lastChatMessageHour
        ? new Date(b.lastChatMessageHour).getTime()
        : new Date(b.createdAt).getTime()

      return lastMessageTimeB - lastMessageTimeA
    })
  }


}
