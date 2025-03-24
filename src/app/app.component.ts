import { Component } from '@angular/core';
import { StorageService } from './core/services/storage.service';
import { contactsSeed, seedChatsPreviewData } from './seed';

@Component({
  selector: 'app-root',
  template: `
    <main class="flex justify-start">
      <shared-sidebar class="w-[64px] " />
      <section class="basis-[40%] max-w-[40%] min-w-[335px]">
        <router-outlet />
      </section>
      <section class="bg-red-500 flex-1">chat-room</section>
    </main>
  `,
  standalone: false,
})
export class AppComponent {
  constructor(private storageService: StorageService) {
    const contacts = contactsSeed;
    const chats = seedChatsPreviewData;
    this.storageService.setItem('originalChats', chats);
    this.storageService.setItem('contacts', contacts);
  }
}
