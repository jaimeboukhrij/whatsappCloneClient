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
  public showSilencedNotificationsModal = signal(false);
  public chatsRoom: WritableSignal<ChatRoomI[]> = signal([]);

  public getChatsRoom() {
    this.userApiService
      .getUserChatsRoom()
      .pipe(map((chatsRoom) => this.sortChats(chatsRoom)))
      .subscribe({
        next: (data) => {
          this.chatsRoom.set(data);
        },
        error(err) {
          console.log(err);
        },
      });
  }

  public async deleteChat(id: string) {
    this.chatRoomApiServie.deleteChatRoom(id).subscribe({
      next: () => {
        const newChats = this.chatsRoom().filter((chat) => chat.id !== id);
        this.storageService.setItem<ChatRoomI[]>('originalChats', newChats)!;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  private sortChats(newChats: ChatRoomI[]) {
    return [...newChats].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (a.isPinned && b.isPinned) {
        const pinnedTimeA = new Date(a.isPinned).getTime();
        const pinnedTimeB = new Date(b.isPinned).getTime();
        return pinnedTimeB - pinnedTimeA;
      }

      const lastMessageTimeA = new Date(a.lastChatMessageHour).getTime();
      const lastMessageTimeB = new Date(b.lastChatMessageHour).getTime();
      return lastMessageTimeB - lastMessageTimeA;
    });
  }
}
