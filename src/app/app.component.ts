import { Component } from '@angular/core';
import { StorageService } from './core/services/storage.service';
import { contactsSeed, seedChatsPreviewData } from './seed';
import { ChatPreviewInterface } from './features/chats/model';

@Component({
  selector: 'app-root',
  template: ` <router-outlet /> `,
  standalone: false,
})
export class AppComponent {
  constructor(private storageService: StorageService) {
    const contacts = contactsSeed;
    const chats = seedChatsPreviewData;
    this.storageService.setItem<ChatPreviewInterface[]>('originalChats', chats);
    this.storageService.setItem('contacts', contacts);
  }
}
