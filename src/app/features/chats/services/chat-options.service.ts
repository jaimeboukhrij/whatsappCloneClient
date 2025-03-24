import { inject, Injectable, signal } from '@angular/core';
import { ChatPreviewInterface, NotificationsSilencedEnum } from '../model';
import { ChatService } from './chat.service';
import { ChatFiltersService } from './chat-filters.service';

@Injectable({ providedIn: 'root' })
export class ChatOptionsService {
  private chatService = inject(ChatService);
  private chatFiltersService = inject(ChatFiltersService);
  private currentIdNotificationsSilencedButton = signal<undefined | string>(
    undefined
  );
  public selectedMuteDuration = signal<NotificationsSilencedEnum | false>(
    NotificationsSilencedEnum.HOUR
  );

  private areThereArchivedChats(newChats: ChatPreviewInterface[]): boolean {
    return newChats.some((elem) => elem.isArchived);
  }

  public onClickArchivedButton(id: string) {
    const newChats = this.chatService.allChats.map((chat) => {
      if (chat.id !== id) return chat;
      return { ...chat, isArchived: !chat.isArchived };
    });

    this.chatService.allChats = newChats;
    if (this.chatService.showArchivedChat()) {
      if (!this.areThereArchivedChats(newChats)) {
        this.chatService.showArchivedChat.update((prev) => !prev);
        this.chatFiltersService.filterChats('all', false);
        return;
      }
      this.chatFiltersService.filterChats('', true);
      return;
    }
    this.chatFiltersService.filterChats('', false);
  }

  public onClickDeletedButton(id: string) {
    this.chatService.deleteChat(id);
    const newChats = this.chatService.allChats.filter((chat) => {
      if (chat.id === id) {
        return false;
      }
      return true;
    });

    if (!this.areThereArchivedChats(this.chatService.allChats)) {
      this.chatService.showArchivedChat.update((prev) => !prev);
      this.chatFiltersService.filterChats('all', false);
      return;
    }

    this.chatFiltersService.filterChats('', true);
    this.chatService.allChats = newChats;
  }
  public setShowChatOptions = (id?: string) => {
    this.chatService.chatsPreviewData.update((values) =>
      values.map((elem) => ({
        ...elem,
        showOptions: elem.id === id,
      }))
    );
  };

  public onClickNotificationsSilencedButton(id: string) {
    this.currentIdNotificationsSilencedButton.set(id);

    if (
      this.chatService.allChats.find((elem) => elem.id === id)
        ?.notificationsSilenced
    ) {
      this.selectedMuteDuration.set(false);
      this.onSubmitNotificationsSilencedButton();
      return;
    }
    this.chatService.showSilencedNotificationsModal.update((prev) => !prev);
  }

  public onSubmitNotificationsSilencedButton() {
    const newChats = this.chatService.allChats.map((chat) => {
      if (chat.id !== this.currentIdNotificationsSilencedButton()) return chat;
      return { ...chat, notificationsSilenced: this.selectedMuteDuration() };
    });

    this.chatService.allChats = newChats;
    this.chatFiltersService.filterChats(
      !this.areThereArchivedChats(this.chatService.allChats) ? 'all' : '',
      false
    );
  }

  public onClickIsPinned(id: string) {
    const newChats = this.chatService.allChats.map((chat) => {
      if (chat.id !== id) return chat;
      return {
        ...chat,
        isPinned: chat.isPinned ? undefined : new Date(),
      };
    });

    this.chatService.allChats = newChats;
    this.chatFiltersService.filterChats('', false);
  }

  public onClickIsRead(id: string) {
    const newChats = this.chatService.allChats.map((chat) => {
      if (chat.id !== id) return chat;
      return {
        ...chat,
        isRead: !chat.isRead,
      };
    });

    this.chatService.allChats = newChats;
    this.chatFiltersService.filterChats('', false);
  }

  public onClickInFavorites(id: string) {
    const newChats = this.chatService.allChats.map((chat) => {
      if (chat.id !== id) return chat;
      return {
        ...chat,
        inFavorites: !chat.inFavorites,
      };
    });

    this.chatService.allChats = newChats;
    this.chatFiltersService.filterChats('', false);
  }
}
