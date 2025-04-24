import { Component, OnInit } from '@angular/core'
import { SocketStatusService } from './core/services/socket/socket-status.service'
import { AuthService } from './modules/auth/services/auth.service'

@Component({
  selector: 'app-root',
  template: ' <router-outlet /> ',
  standalone: false
})
export class AppComponent implements OnInit {
  constructor (private readonly socketStatusService: SocketStatusService,
    private readonly authService: AuthService
  ) {}

  ngOnInit (): void {
    this.socketStatusService.on('token-error', ()=>{
      this.authService.logOut()
    })
  }
}
