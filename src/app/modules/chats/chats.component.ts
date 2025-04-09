import { Component, inject,  OnInit, signal } from '@angular/core'
import { ChatPreviewFiltersEnum } from './model'
import { ChatFiltersService } from './services/chat-filters.service'
import { ChatService } from './services/chat.service'

@Component({
  standalone: false,
  templateUrl: './chats.component.html'
})
export class ChatsComponent implements OnInit {
  private readonly chatFiltersService = inject(ChatFiltersService)
  private readonly chatService = inject(ChatService)
  public showSilencedNotificationsModal =
    this.chatService.showSilencedNotificationsModal

  public chatsPreviewData = this.chatService.chats
  public isChatInputLoading = this.chatFiltersService.isChatInputLoading

  public buttonText = [
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

  public currenIndexBtnActive = signal('all')

  ngOnInit (): void {
    this.chatService.getChats()
  }

  get showArchivedChat () {
    return this.chatService.showArchivedChat()
  }

  onClickButton (id: string) {
    this.currenIndexBtnActive.set(id)
    this.chatFiltersService.filterChats(id)
  }

  onChangeQueryInput (event: string) {
    this.chatFiltersService.searchChatByQuery(event)
  }

  toggleShowArchivedChat () {
    this.chatFiltersService.filterChats(
      this.showArchivedChat
        ? ChatPreviewFiltersEnum.ALL
        : ChatPreviewFiltersEnum.ARCHIVED
    )
    this.chatService.showArchivedChat.update((prev) => !prev)
  }
}
