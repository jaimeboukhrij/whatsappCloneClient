import { inject, Injectable, signal,  WritableSignal } from '@angular/core'
import { ChatI } from '../model'
import { catchError, map, Observable, of, tap } from 'rxjs'
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

  public showLeaveGroupModal = signal({
    chatId: '',
    show: false
  })

  public originalChats: WritableSignal<ChatI[]> = signal([])
  public chats: WritableSignal<ChatI[]> = signal([])

  public getChats (updateChats = true): Observable<ChatI[]> {
    return this.userApiService.getUserChats().pipe(
      map((chats) => this.sortChats(chats)),
      tap((data) => {
        const chatsVisibles = data.filter((chat) => !chat.isArchived)
        if (updateChats) this.chats.set(chatsVisibles)
        this.originalChats.set(data)
      }),
      catchError((error) => {
        console.log(error)
        return of([])
      })
    )
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
      next: () => {
        this.getChats().subscribe()
      },
      error: (error) => {
        this.chats.set(prevChats)
        console.log(error)
      }
    })
  }


  public updateChat (id: string, newChats: ChatI[], data: Partial<ChatI>) {
    const prevChats = this.chats()
    this.chats.set(newChats)

    this.chatRoomApiServie.updateChatRoom(id, data).subscribe({
      next: () => { this.getChats(false).subscribe() },
      error: (error) => {
        this.chats.set(prevChats)
        console.log(error)
      }
    })
  }

  createChat (contactId: string,  type: 'private' | 'group'): Observable<ChatI> {
    return this.chatApiServie.createChat(contactId, type)
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
