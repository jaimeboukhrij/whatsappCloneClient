import { Injectable, signal } from '@angular/core';
import { ChatPreviewFiltersEnum } from '../model';
import { debounceTime, Subject } from 'rxjs';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChatFiltersService {
  private searchQuery$ = new Subject<string>();
  public isChatInputLoading = signal(false);
  private currenInputQuery = signal('');

  constructor(private chatService: ChatService) {
    this.filterChats('');
    this.searchQuery$.pipe(debounceTime(200)).subscribe(() => {
      this.filterChats('');
      this.isChatInputLoading.set(false);
    });
  }

  public searchChatByQuery = (q: string) => {
    this.isChatInputLoading.set(true);
    this.currenInputQuery.set(q);
    this.searchQuery$.next(q);
  };

  public filterChats = (id: string) => {
    switch (id) {
      case ChatPreviewFiltersEnum.ALL:
        this.chatService.resetToOriginalChats();
        break;
      case ChatPreviewFiltersEnum.NO_READ:
        this.chatService.chatsRoom.set(
          this.chatService
            .originalChatsRoom()
            .filter((chat) => !chat.isRead && !chat.isArchived)
        );
        break;
      case ChatPreviewFiltersEnum.FAVORITE:
        this.chatService.chatsRoom.set(
          this.chatService
            .originalChatsRoom()
            .filter((chat) => chat.inFavorites && !chat.isArchived)
        );
        break;
      case ChatPreviewFiltersEnum.GROUPS:
        this.chatService.chatsRoom.set(
          this.chatService
            .originalChatsRoom()
            .filter((chat) => chat.type === 'group' && !chat.isArchived)
        );
        break;

      case ChatPreviewFiltersEnum.ARCHIVED:
        this.chatService.chatsRoom.set(
          this.chatService.originalChatsRoom().filter((chat) => chat.isArchived)
        );
        break;

      default:
        break;
    }
  };
}
