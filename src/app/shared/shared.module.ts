import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SidebarComponent } from '../layout/sidebar/sidebar.component'
import { IconsModule } from './components/icons/icons.module'
import { RouterModule } from '@angular/router'
import { SpinnersModule } from './components/spinners/spinners.module'
import { ChatInputComponent } from './components/chats-input/chats-input.component'
import { EmojiPickerComponent } from './components/emoji-picker/emoji-picker.component'

@NgModule({
  declarations: [SidebarComponent, ChatInputComponent, EmojiPickerComponent],
  imports: [CommonModule, IconsModule, RouterModule, SpinnersModule],
  exports: [
    SidebarComponent,
    SpinnersModule,
    IconsModule,
    ChatInputComponent,
    EmojiPickerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
