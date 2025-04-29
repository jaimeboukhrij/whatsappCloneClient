import { Component, inject, signal } from '@angular/core'
import { ChatFiltersService } from './services/chats-filters.service'
import { ChatService } from './services/chats.service'
import { ChatFiltersEnum } from './interfaces'



@Component({
  standalone: false,
  templateUrl: './chats.component.html'
})
export class ChatsComponent {
  private readonly chatFiltersService = inject(ChatFiltersService)
  private readonly chatService = inject(ChatService)
  public showSilencedNotificationsModal = this.chatService.showSilencedNotificationsModal
  public showLeaveGroupModal = this.chatService.showLeaveGroupModal
  public showStarredMessages = this.chatService.showStarredMessages


  public chatsPreviewData = this.chatService.chats
  public isChatInputLoading = this.chatFiltersService.isChatInputLoading

  public buttonFilterText = this.chatFiltersService.buttonFilterText



  public currenIndexBtnActive = signal('all')



  get showArchivedChat () {
    return this.chatService.showArchivedChat()
  }

  onClickButton (id?: ChatFiltersEnum ) {
    if (!id) id = ChatFiltersEnum.ALL
    this.currenIndexBtnActive.set(id)
    this.chatFiltersService.filterChats(id)
  }

  onChangeQueryInput (event: string) {
    this.chatFiltersService.searchChatByQuery(event)
  }

  toggleShowArchivedChat () {
    this.chatFiltersService.filterChats(
      this.showArchivedChat
        ? ChatFiltersEnum.ALL
        : ChatFiltersEnum.ARCHIVED
    )
    this.chatService.showArchivedChat.update((prev) => !prev)
  }
}
