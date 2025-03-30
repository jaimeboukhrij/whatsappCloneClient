import { inject, Injectable, signal } from '@angular/core';
import { ChatRoomI, NotificationsSilencedEnum } from '../model';
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

  private areThereArchivedChats(newChats: ChatRoomI[]): boolean {
    return newChats.some((elem) => elem.isArchived);
  }

  public onClickArchivedButton(id: string) {
    const newChats = this.chatService.chatsRoom().map((chat) => {
      if (chat.id !== id) return chat;
      return { ...chat, isArchived: !chat.isArchived };
    });

    this.chatService.chatsRoom.set(newChats);
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

  public async onClickDeletedButton(id: string) {
    await this.chatService.deleteChat(id);
    const newChats = this.chatService.chatsRoom().filter((chat) => {
      if (chat.id === id) {
        return false;
      }
      return true;
    });
    this.chatService.chatsRoom.set(newChats);

    // if (!this.areThereArchivedChats(this.chatService.chatsRoom())) {
    //   this.chatService.showArchivedChat.update((prev) => !prev);
    //   this.chatFiltersService.filterChats('all', false);
    //   return;
    // }

    // this.chatFiltersService.filterChats('', true);
    // this.chatService.chatsRoom.set(newChats);
  }
  public setShowChatOptions = (id?: string) => {
    this.chatService.chatsRoom.update((values) =>
      values.map((elem) => ({
        ...elem,
        showOptions: elem.id === id,
      }))
    );
  };

  public onClickNotificationsSilencedButton(id: string) {
    this.currentIdNotificationsSilencedButton.set(id);

    if (
      this.chatService.chatsRoom().find((elem) => elem.id === id)
        ?.notificationsSilenced
    ) {
      this.selectedMuteDuration.set(false);
      this.onSubmitNotificationsSilencedButton();
      return;
    }
    this.chatService.showSilencedNotificationsModal.update((prev) => !prev);
  }

  public onSubmitNotificationsSilencedButton() {
    const newChats = this.chatService.chatsRoom().map((chat) => {
      if (chat.id !== this.currentIdNotificationsSilencedButton()) return chat;
      return { ...chat, notificationsSilenced: this.selectedMuteDuration() };
    });

    this.chatService.chatsRoom.set(newChats);
    this.chatFiltersService.filterChats(
      !this.areThereArchivedChats(this.chatService.chatsRoom()) ? 'all' : '',
      false
    );
  }

  public onClickIsPinned(id: string) {
    const newChats = this.chatService.chatsRoom().map((chat) => {
      if (chat.id !== id) return chat;
      return {
        ...chat,
        isPinned: chat.isPinned ? undefined : new Date(),
      };
    });

    this.chatService.chatsRoom.set(newChats);
    this.chatFiltersService.filterChats('', false);
  }

  public onClickIsRead(id: string) {
    const newChats = this.chatService.chatsRoom().map((chat) => {
      if (chat.id !== id) return chat;
      return {
        ...chat,
        isRead: !chat.isRead,
      };
    });

    this.chatService.chatsRoom.set(newChats);
    this.chatFiltersService.filterChats('', false);
  }

  public onClickInFavorites(id: string) {
    const newChats = this.chatService.chatsRoom().map((chat) => {
      if (chat.id !== id) return chat;
      return {
        ...chat,
        inFavorites: !chat.inFavorites,
      };
    });

    this.chatService.chatsRoom.set(newChats);
    this.chatFiltersService.filterChats('', false);
  }
}
