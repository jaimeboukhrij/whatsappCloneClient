import { inject, Injectable, signal } from '@angular/core';
import { NotificationsSilencedEnum } from '../model';
import { ChatService } from './chat.service';

@Injectable({ providedIn: 'root' })
export class ChatOptionsService {
  private readonly chatService = inject(ChatService);

  private currentIdNotificationsSilencedButton = signal<undefined | string>(
    undefined
  );
  public selectedMuteDuration = signal<NotificationsSilencedEnum | null>(
    NotificationsSilencedEnum.HOUR
  );

  public onClickArchivedButton(id: string) {
    const prevChatsRoom = this.chatService.chatsRoom();
    const isChatRoomArchived = prevChatsRoom.find(
      (chat) => chat.id === id
    )?.isArchived;
    const newChatsRoom = prevChatsRoom
      .map((chat) => {
        if (chat.id !== id) return chat;
        return { ...chat, isArchived: !chat.isArchived };
      })
      .filter((chat) =>
        this.chatService.showArchivedChat() ? chat.isArchived : !chat.isArchived
      );

    this.chatService.updateChatRoom(id, newChatsRoom, {
      isArchived: !isChatRoomArchived,
    });
  }

  public async onClickDeletedButton(id: string) {
    const newChatsRoom = this.chatService
      .chatsRoom()
      .filter((chat) => chat.id !== id);

    this.chatService.deleteChat(id, newChatsRoom);
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
      this.selectedMuteDuration.set(null);
      this.onSubmitNotificationsSilencedButton(id);
      return;
    }
    this.chatService.showSilencedNotificationsModal.update((prev) => ({
      chatRoomId: id ? id : prev.chatRoomId,
      show: !prev.show,
    }));
  }

  public onSubmitNotificationsSilencedButton(id: string) {
    const newChats = this.chatService.chatsRoom().map((chat) => {
      if (chat.id !== this.currentIdNotificationsSilencedButton()) return chat;
      return { ...chat, notificationsSilenced: this.selectedMuteDuration() };
    });

    this.chatService.updateChatRoom(id, newChats, {
      notificationsSilenced: this.selectedMuteDuration(),
    });
  }

  public onClickIsPinned(id: string) {
    const prevChatsRoom = this.chatService.chatsRoom();
    const isChatRoomPinned = prevChatsRoom.find(
      (chat) => chat.id === id
    )?.isPinned;
    const newChats = this.chatService.chatsRoom().map((chat) => {
      if (chat.id !== id) return chat;
      return {
        ...chat,
        isPinned: chat.isPinned ? null : new Date(),
      };
    });
    const sortedChatsRoom = this.chatService.sortChats(newChats);
    this.chatService.updateChatRoom(id, sortedChatsRoom, {
      isPinned: isChatRoomPinned ? null : new Date(),
    });
  }

  public async onClickIsRead(id: string) {
    const prevChatsRoom = this.chatService.chatsRoom();
    const isChatRoomRead = prevChatsRoom.find((chat) => chat.id === id)?.isRead;
    const newChatsRoom = prevChatsRoom.map((chat) => {
      if (chat.id !== id) return chat;
      return {
        ...chat,
        isRead: !chat.isRead,
      };
    });

    this.chatService.updateChatRoom(id, newChatsRoom, {
      isRead: !isChatRoomRead,
    });
  }

  public async onClickIsBlocked(id: string) {
    const prevChatsRoom = this.chatService.chatsRoom();
    const isChatRoomBlocked = prevChatsRoom.find(
      (chat) => chat.id === id
    )?.isBlocked;
    const newChatsRoom = prevChatsRoom.map((chat) => {
      if (chat.id !== id) return chat;
      return {
        ...chat,
        isBlocked: !chat.isBlocked,
      };
    });

    this.chatService.updateChatRoom(id, newChatsRoom, {
      isBlocked: !isChatRoomBlocked,
    });
  }

  public onClickInFavorites(id: string) {
    const prevChatsRoom = this.chatService.chatsRoom();

    const isChatRoomInFavorites = prevChatsRoom.find(
      (chat) => chat.id === id
    )?.inFavorites;
    const newChatsRoom = prevChatsRoom.map((chat) => {
      if (chat.id !== id) return chat;
      return {
        ...chat,
        inFavorites: !chat.inFavorites,
      };
    });

    this.chatService.updateChatRoom(id, newChatsRoom, {
      inFavorites: !isChatRoomInFavorites,
    });
  }
}
