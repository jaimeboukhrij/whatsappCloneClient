import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ChatsRoutingModule } from './chats-routing.module'
import { ChatsComponent } from './chats.component'
import { SharedModule } from '../../shared/shared.module'
import { ChatHeaderComponent } from './components/chat-header/chat-header.component'
import { IconsModule } from '../../shared/components/icons/icons.module'
import { ChatButtonComponent } from './components/chat-button/chat-button.component'
import { ChatPreviewComponent } from './components/chat-preview/chat-preview.component'
import { ChatPreviewOptionsComponent } from './components/chat-preview-options/chat-preview-options.component'
import { SpinnersModule } from '../../shared/components/spinners/spinners.module'
import { ChatArchivedComponent } from './components/chat-archived/chat-archived.component'
import { FormsModule } from '@angular/forms'
import { ChatNotificationsSilencedModalComponent } from './components/chat-preview-options/components/chat-notifications-silenced-modal/chat-notifications-silenced-modal.component'

@NgModule({
  declarations: [
    ChatsComponent,
    ChatHeaderComponent,
    ChatButtonComponent,
    ChatPreviewComponent,
    ChatPreviewOptionsComponent,
    ChatArchivedComponent,
    ChatNotificationsSilencedModalComponent
  ],
  imports: [
    CommonModule,
    ChatsRoutingModule,
    SharedModule,
    IconsModule,
    SpinnersModule,
    FormsModule
  ]
})
export class ChatsModule {}
