import { Injectable, signal } from '@angular/core';
import {
  ChatPreviewFiltersInterface,
  ChatPreviewInterface,
  ChatPreviewFiltersEnum,
} from '../model';
import { debounceTime, Subject } from 'rxjs';
import { ChatService } from './chat.service';

type ChatPreviewFilterKey = keyof ChatPreviewFiltersInterface;

@Injectable({
  providedIn: 'root',
})
export class ChatFiltersService {
  private searchQuery$ = new Subject<string>();
  public isChatInputLoading = signal(false);
  private currenInputQuery = signal('');
  private chatPreviewFilterButtonActive = signal<ChatPreviewFiltersInterface>({
    query: '',
    favorite: false,
    groups: false,
    noRead: false,
    all: true,
  });

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

  public filterChats(id: string, showArchivedChats = false) {
    let filteredChats = this.chatService.allChats;

    if (id === ChatPreviewFiltersEnum.ALL) {
      this.resetChatsFilters();
      this.chatService.chatsPreviewData.set(this.filterChatsByArchived(false));
      return;
    }

    if (id) this.setChatsFilters(id as ChatPreviewFiltersEnum);

    if (this.chatPreviewFilterButtonActive().noRead) {
      filteredChats = this.filterChatsByNoRead(filteredChats);
    }
    if (this.chatPreviewFilterButtonActive().favorite) {
      filteredChats = this.filterChatsByFavorite(filteredChats);
    }

    if (this.chatPreviewFilterButtonActive().groups) {
      filteredChats = this.filterChatsByGroup(filteredChats);
    }

    filteredChats = this.filterChatsByArchived(
      showArchivedChats,
      filteredChats
    );

    if (this.currenInputQuery())
      filteredChats = this.filterChatsByQuery(filteredChats);

    this.chatService.chatsPreviewData.set(filteredChats);
  }

  private resetChatsFilters() {
    this.chatPreviewFilterButtonActive.set({
      query: '',
      favorite: false,
      groups: false,
      noRead: false,
      all: true,
    });
  }

  private setChatsFilters(buttonId: ChatPreviewFilterKey) {
    this.resetChatsFilters();
    this.chatPreviewFilterButtonActive.update((prev) => ({
      ...prev,
      all: false,
      [buttonId]: !prev[buttonId],
    }));
  }

  //* FILTER_CHATS_BY

  private filterChatsByQuery(filteredChats: ChatPreviewInterface[]) {
    return filteredChats.filter((chat) =>
      chat.name.toLowerCase().includes(this.currenInputQuery().toLowerCase())
    );
  }
  private filterChatsByNoRead(filteredChats: ChatPreviewInterface[]) {
    return filteredChats.filter(
      (chat) => chat.isRead === !this.chatPreviewFilterButtonActive().noRead
    );
  }
  private filterChatsByFavorite(filteredChats: ChatPreviewInterface[]) {
    return filteredChats.filter(
      (chat) =>
        chat.inFavorites === this.chatPreviewFilterButtonActive().favorite
    );
  }
  private filterChatsByGroup(filteredChats: ChatPreviewInterface[]) {
    return filteredChats.filter(
      (chat) => chat.isGroup === this.chatPreviewFilterButtonActive().groups
    );
  }
  private filterChatsByArchived(
    showArchivedChats: boolean,
    filteredChats?: ChatPreviewInterface[]
  ) {
    filteredChats = filteredChats ?? this.chatService.allChats;
    const archivedChats = filteredChats.filter(
      (chat) => chat.isArchived === showArchivedChats
    );
    return archivedChats;
  }
}
