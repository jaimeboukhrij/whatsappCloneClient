import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatsRoomComponent } from './chats-room.component';

const routes: Routes = [{ path: '', component: ChatsRoomComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatsRoomRoutingModule {}
