import { inject, Injectable, signal,  WritableSignal } from '@angular/core'
import { ChatI } from '../model'
import { catchError, map, Observable, of } from 'rxjs'
import {  UserApiService } from '../../../core/services/api'
import { UserService } from '../../user/services/user.service'

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly userApiService = inject(UserApiService)
  private readonly userService = inject(UserService)

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

  public totalMessagesNotRead = signal(0)

  public getChats (updateChats = true): Observable<ChatI[]> {
    return this.userApiService.getUserChats().pipe(
      map((chats) => {
        const sorted = this.sortChats(chats)
        const chatsVisibles = sorted
          .filter(chat => !chat.isArchived)
        if (updateChats) this.chats.set(chatsVisibles)
        this.originalChats.set(sorted)
        this.getMessagesChatsWithOutRead(chatsVisibles)

        console.log('***', chatsVisibles)
        return chatsVisibles
      }),
      catchError((error) => {
        console.log(error)
        return of([])
      })
    )


  }


  public resetToOriginalChats () {
    const notArchivedChats = this.originalChats().filter((chats) => !chats.isArchived)
    const sortedChats = this.sortChats(notArchivedChats)
    this.chats.set(sortedChats)
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

  private getMessagesChatsWithOutRead (chats: ChatI[]) {
    let messagesNotRead = 0
    chats.forEach(chat =>{
      messagesNotRead += chat.messages.filter(message => !message.isRead && message.type === 'received').length
    })
    this.totalMessagesNotRead.set(messagesNotRead)
  }


}
