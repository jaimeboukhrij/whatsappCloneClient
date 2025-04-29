import { Injectable, signal } from '@angular/core'
import { debounceTime, Subject } from 'rxjs'
import {  ChatService } from './chats.service'
import { ChatFiltersEnum } from '../interfaces'


@Injectable({
  providedIn: 'root'
})
export class ChatFiltersService {
  private readonly searchQuery$ = new Subject<string>()
  public isChatInputLoading = signal(false)
  private readonly currenInputQuery = signal('')
  readonly currentIdFilterChat = signal(ChatFiltersEnum.ALL)
  public buttonFilterText = [
    {
      text: 'Todos',
      id: ChatFiltersEnum.ALL
    },
    {
      text: 'No leídos',
      id: ChatFiltersEnum.NO_READ
    },
    {
      text: 'Favoritos',
      id: ChatFiltersEnum.FAVORITE
    },
    {
      text: 'Grupos',
      id: ChatFiltersEnum.GROUPS
    }
  ]

  constructor (private readonly chatService: ChatService) {
    this.filterChats(ChatFiltersEnum.ALL)
    this.searchQuery$.pipe(debounceTime(200)).subscribe(() => {
      this.filterChats(ChatFiltersEnum.ALL)
      this.isChatInputLoading.set(false)
    })
  }

  public searchChatByQuery = (q: string) => {
    this.isChatInputLoading.set(true)
    this.currenInputQuery.set(q)
    this.searchQuery$.next(q)
  }

  public filterChats = (id?: ChatFiltersEnum) => {
    if (id) this.currentIdFilterChat.set(id)
    switch (this.currentIdFilterChat()) {
      case ChatFiltersEnum.ALL:
        this.chatService.resetToOriginalChats()
        break
      case ChatFiltersEnum.NO_READ:
        this.chatService.chats.set(
          this.chatService
            .originalChats()
            .filter((chat) => !chat.isRead && !chat.isArchived)
        )
        break
      case ChatFiltersEnum.FAVORITE:
        this.chatService.chats.set(
          this.chatService
            .originalChats()
            .filter((chat) => chat.inFavorites && !chat.isArchived)
        )
        break
      case ChatFiltersEnum.GROUPS:
        this.chatService.chats.set(
          this.chatService
            .originalChats()
            .filter((chat) => chat.type === 'group' && !chat.isArchived)
        )
        break

      case ChatFiltersEnum.ARCHIVED:
        this.chatService.chats.set(
          this.chatService.originalChats().filter((chat) => chat.isArchived)
        )
        break

      default:
        break
    }
  }
}
