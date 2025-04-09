import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HomeComponent } from './home/home.component'
import { SharedModule } from '../shared/shared.module'
import { LayoutRoutingModule } from './layout-routing.module'
import { GroupsModule } from '../modules/groups/groups.module'
import { UserModule } from '../modules/user/user.module'
import { AuthModule } from '../modules/auth/auth.module'
import { ChatsModule } from '../modules/chats/chats.module'

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    SharedModule,
    LayoutRoutingModule,
    GroupsModule,
    UserModule,
    AuthModule,
    ChatsModule
  ]
})
export class LayoutModule {}
