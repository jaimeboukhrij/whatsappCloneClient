import { Injectable } from '@angular/core'
import {  CanActivate,  Router } from '@angular/router'
import { AuthService } from '../../modules/auth/services/auth.service' // Importación correcta

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // Inyección a través del constructor
  constructor (
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  async canActivate (): Promise<boolean> {
    if (this.authService.isAuthenticated()) {
      return true
    } else {
      await this.router.navigate(['/auth'])
      return false
    }
  }
}
