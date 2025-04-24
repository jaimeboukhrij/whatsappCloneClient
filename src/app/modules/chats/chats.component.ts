import { Component, inject, signal } from '@angular/core'
import { ChatPreviewFiltersEnum } from './model'
import { ChatFiltersService } from './services/chats-filters.service'
import { ChatService } from './services/chats.service'
import { ChatsRoomService } from './components/chats-room/services/chats-room.service'

@Component({
  standalone: false,
  templateUrl: './chats.component.html'
})
export class ChatsComponent {
  private readonly chatFiltersService = inject(ChatFiltersService)
  private readonly chatService = inject(ChatService)
  private readonly chatsRoomService = inject(ChatsRoomService)
  public showSilencedNotificationsModal = this.chatService.showSilencedNotificationsModal
  public showLeaveGroupModal = this.chatService.showLeaveGroupModal


  public chatsPreviewData = this.chatService.chats
  public isChatInputLoading = this.chatFiltersService.isChatInputLoading

  public buttonFilterText = this.chatFiltersService.buttonFilterText



  public currenIndexBtnActive = signal('all')



  get showArchivedChat () {
    return this.chatService.showArchivedChat()
  }

  onClickButton (id?: ChatPreviewFiltersEnum) {
    if (!id) id = ChatPreviewFiltersEnum.ALL
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
