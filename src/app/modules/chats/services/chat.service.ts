import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ChatRoomI } from '../model';
import { StorageService } from '../../../core/services/storage.service';
import { map } from 'rxjs';
import { ChatRoomApiService, UserApiService } from '../../../core/services/api';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private storageService = inject(StorageService);
  private userApiService = inject(UserApiService);
  private chatRoomApiServie = inject(ChatRoomApiService);

  public showArchivedChat = signal(false);
  public showSilencedNotificationsModal = signal({
    chatRoomId: '',
    show: false,
  });
  public originalChatsRoom: WritableSignal<ChatRoomI[]> = signal([]);
  public chatsRoom: WritableSignal<ChatRoomI[]> = signal([]);

  public getChatsRoom(updateChatsRoom = true) {
    this.userApiService
      .getUserChatsRoom()
      .pipe(map((chatsRoom) => this.sortChats(chatsRoom)))
      .subscribe({
        next: (data) => {
          const chatsRoomVisibles = data.filter((chat) => !chat.isArchived);
          if (updateChatsRoom) this.chatsRoom.set(chatsRoomVisibles);
          this.originalChatsRoom.set(data);
        },
        error(err) {
          console.log(err);
        },
      });
  }

  public resetToOriginalChats() {
    this.chatsRoom.set(
      this.originalChatsRoom().filter((chats) => !chats.isArchived)
    );
  }

  public async deleteChat(id: string, newChatsRoom: ChatRoomI[]) {
    const prevChatsRoom = this.chatsRoom();
    this.chatsRoom.set(newChatsRoom);

    this.chatRoomApiServie.deleteChatRoom(id).subscribe({
      next: () => this.getChatsRoom(false),
      error: (error) => {
        this.chatsRoom.set(prevChatsRoom);
        console.log(error);
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public updateChatRoom(id: string, newChatsRoom: ChatRoomI[], data: any) {
    const prevChatsRoom = this.chatsRoom();
    this.chatsRoom.set(newChatsRoom);

    this.chatRoomApiServie.updateChatRoom(id, data).subscribe({
      next: () => this.getChatsRoom(false),
      error: (error) => {
        this.chatsRoom.set(prevChatsRoom);
        console.log(error);
      },
    });
  }

  getArchivedChats() {
    const archivedChats = this.chatsRoom().filter((chat) => chat.isArchived);
    return archivedChats;
  }

  sortChats(newChats: ChatRoomI[]) {
    return [...newChats].sort((a, b) => {
      const isPinnedA = a.isPinned ? new Date(a.isPinned).getTime() : 0;
      const isPinnedB = b.isPinned ? new Date(b.isPinned).getTime() : 0;

      if (isPinnedA && !isPinnedB) return -1;
      if (!isPinnedA && isPinnedB) return 1;
      if (isPinnedA && isPinnedB) return isPinnedB - isPinnedA;

      const lastMessageTimeA = a.lastChatMessageHour
        ? new Date(a.lastChatMessageHour).getTime()
        : new Date(a.createdAt).getTime();

      const lastMessageTimeB = b.lastChatMessageHour
        ? new Date(b.lastChatMessageHour).getTime()
        : new Date(b.createdAt).getTime();

      return lastMessageTimeB - lastMessageTimeA;
    });
  }
}
