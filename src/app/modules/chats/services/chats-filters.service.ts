import { Injectable, signal } from '@angular/core'
import { ChatPreviewFiltersEnum } from '../model'
import { debounceTime, Subject } from 'rxjs'
import {  ChatService } from './chats.service'

@Injectable({
  providedIn: 'root'
})
export class ChatFiltersService {
  private readonly searchQuery$ = new Subject<string>()
  public isChatInputLoading = signal(false)
  private readonly currenInputQuery = signal('')
  public buttonFilterText = [
    {
      text: 'Todos',
      id: ChatPreviewFiltersEnum.ALL
    },
    {
      text: 'No leídos',
      id: ChatPreviewFiltersEnum.NO_READ
    },
    {
      text: 'Favoritos',
      id: ChatPreviewFiltersEnum.FAVORITE
    },
    {
      text: 'Grupos',
      id: ChatPreviewFiltersEnum.GROUPS
    }
  ]

  constructor (private readonly chatService: ChatService) {
    this.filterChats('')
    this.searchQuery$.pipe(debounceTime(200)).subscribe(() => {
      this.filterChats('')
      this.isChatInputLoading.set(false)
    })
  }

  public searchChatByQuery = (q: string) => {
    this.isChatInputLoading.set(true)
    this.currenInputQuery.set(q)
    this.searchQuery$.next(q)
  }

  public filterChats = (id: string) => {
    switch (id) {
      case ChatPreviewFiltersEnum.ALL:
        this.chatService.resetToOriginalChats()
        break
      case ChatPreviewFiltersEnum.NO_READ:
        this.chatService.chats.set(
          this.chatService
            .originalChats()
            .filter((chat) => !chat.isRead && !chat.isArchived)
        )
        break
      case ChatPreviewFiltersEnum.FAVORITE:
        this.chatService.chats.set(
          this.chatService
            .originalChats()
            .filter((chat) => chat.inFavorites && !chat.isArchived)
        )
        break
      case ChatPreviewFiltersEnum.GROUPS:
        this.chatService.chats.set(
          this.chatService
            .originalChats()
            .filter((chat) => chat.type === 'group' && !chat.isArchived)
        )
        break

      case ChatPreviewFiltersEnum.ARCHIVED:
        this.chatService.chats.set(
          this.chatService.originalChats().filter((chat) => chat.isArchived)
        )
        break

      default:
        break
    }
  }
}
