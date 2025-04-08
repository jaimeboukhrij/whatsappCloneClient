import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatsRoomComponent } from './chats-room.component';
import { ChatsRoomRoutingModule } from './chats-room-routing.module';
import { IconsModule } from '../../shared/components/icons/icons.module';
import { ChatsRoomHeaderComponent } from './chats-room-header/chats-room-header.component';
import { ChatsRoomFooterComponent } from './chats-room-footer/chats-room-footer.component';
import { ChatsRoomBodyComponent } from './chats-room-body/chats-room-body.component';
import { ChatsRoomMessagesComponent } from './chats-room-messages/chats-room-messages.component';

@NgModule({
  declarations: [ChatsRoomComponent, ChatsRoomHeaderComponent, ChatsRoomFooterComponent, ChatsRoomBodyComponent, ChatsRoomMessagesComponent],
  imports: [ChatsRoomRoutingModule, CommonModule, IconsModule],
  exports: [ChatsRoomComponent],
})
export class ChatsRoomModule {}
