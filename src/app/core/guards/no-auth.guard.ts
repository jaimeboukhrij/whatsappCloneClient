import { Injectable } from '@angular/core'
import {  CanActivate,   Router } from '@angular/router'
import {  AuthService } from '../../modules/auth/services/auth.service'

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor (private readonly authService: AuthService, private readonly router: Router) {}

  async canActivate (): Promise <boolean> {
    if (this.authService.isAuthenticated()) {
      await this.router.navigate(['/chats'])
      return false
    }
    return true
  }
}
