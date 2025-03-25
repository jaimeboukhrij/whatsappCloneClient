import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ChatPreviewInterface } from '../model';
import { StorageService } from '../../../core/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private storageService = inject(StorageService);
  public showArchivedChat = signal(false);
  public showSilencedNotificationsModal = signal(false);
  public chatsPreviewData: WritableSignal<ChatPreviewInterface[]> = signal([]);

  get allChats() {
    const localStorageChats = (
      this.storageService.getItem('originalChats') as {
        data: ChatPreviewInterface[];
      }
    )?.data;

    return this.sortChats(localStorageChats);
  }

  set allChats(newChats: ChatPreviewInterface[]) {
    this.storageService.setItem<ChatPreviewInterface[]>(
      'originalChats',
      newChats
    )!;
  }

  public deleteChat(id: string) {
    const chats = this.allChats;
    const newChats = chats.filter((chat) => chat.id !== id);
    this.storageService.setItem<ChatPreviewInterface[]>(
      'originalChats',
      newChats
    )!;
  }

  private sortChats(newChats: ChatPreviewInterface[]) {
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
