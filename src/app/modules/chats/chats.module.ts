import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ChatsRoutingModule } from './chats-routing.module'
import { ChatsComponent } from './chats.component'
import { SharedModule } from '../../shared/shared.module'
import { ChatHeaderComponent } from './components/chat-header/chat-header.component'
import { IconsModule } from '../../shared/components/icons/icons.module'
import { ChatButtonComponent } from './components/chat-button/chat-button.component'
import { ChatPreviewComponent } from './components/chat-preview/chat-preview.component'
import { SpinnersModule } from '../../shared/components/spinners/spinners.module'
import { ChatArchivedComponent } from './components/chat-archived/chat-archived.component'
import { FormsModule } from '@angular/forms'
import { ChatsRoomComponent } from './components/chats-room/chats-room.component'
import { ChatsRoomBodyComponent } from './components/chats-room/components/chats-room-body/chats-room-body.component'
import { ChatsRoomFooterComponent } from './components/chats-room/components/chats-room-footer/chats-room-footer.component'
import { ChatsRoomHeaderComponent } from './components/chats-room/components/chats-room-header/chats-room-header.component'
import { ChatsRoomMessagesComponent } from './components/chats-room/components/chats-room-messages/chats-room-messages.component'
import { ChatPreviewOptionsComponent } from './components/chat-preview/components/chat-preview-options/chat-preview-options.component'
import { ChatNotificationsSilencedModalComponent } from './components/chat-preview/components/chat-notifications-silenced-modal/chat-notifications-silenced-modal.component';
import { ChatPreviewLeaveGroupModalComponent } from './components/chat-preview/components/chat-preview-leave-group-modal/chat-preview-leave-group-modal.component'


@NgModule({
  declarations: [
    ChatsComponent,
    ChatHeaderComponent,
    ChatButtonComponent,
    ChatPreviewComponent,
    ChatPreviewOptionsComponent,
    ChatArchivedComponent,
    ChatNotificationsSilencedModalComponent,
    ChatsRoomComponent,
    ChatsRoomHeaderComponent,
    ChatsRoomBodyComponent,
    ChatsRoomFooterComponent,
    ChatsRoomMessagesComponent,
    ChatPreviewLeaveGroupModalComponent
  ],
  imports: [
    CommonModule,
    ChatsRoutingModule,
    SharedModule,
    IconsModule,
    SpinnersModule,
    FormsModule
  ],
  exports: [ChatsRoomComponent]
})
export class ChatsModule {}
