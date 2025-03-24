import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { IconsModule } from './components/icons/icons.module';
import { RouterModule } from '@angular/router';
import { SpinnersModule } from './components/spinners/spinners.module';
import { ChatInputComponent } from './components/chats-input/chats-input.component';

@NgModule({
  declarations: [SidebarComponent, ChatInputComponent],
  imports: [CommonModule, IconsModule, RouterModule, SpinnersModule],
  exports: [SidebarComponent, SpinnersModule, IconsModule, ChatInputComponent],
})
export class SharedModule {}
