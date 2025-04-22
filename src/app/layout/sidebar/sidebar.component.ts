import { ChatService } from '../../modules/chats/services/chats.service'
import { UserService } from '../../modules/user/services/user.service'
import { AuthService } from './../../modules/auth/services/auth.service'
import { Component, inject } from '@angular/core'

@Component({
  selector: 'shared-sidebar',
  standalone: false,

  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  public iconColor = '#ADBAC1'
  private readonly authService = inject(AuthService)
  private readonly usersService = inject(UserService)
  private readonly chatServie = inject(ChatService)
  public userData = this.usersService.loginUserData
  public totalMessagesNotRead = this.chatServie.totalMessagesNotRead


  logOut () {
    this.authService.logOut()
  }
}
