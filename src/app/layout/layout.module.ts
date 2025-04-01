import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { GroupsModule } from '../modules/groups/groups.module';
import { ChatsRoomModule } from '../modules/chats-room/chats-room.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    SharedModule,
    LayoutRoutingModule,
    GroupsModule,
    ChatsRoomModule,
  ],
})
export class LayoutModule {}
