import {  SocketStatusService } from './../../../core/services/socket/socket-status.service'
import { Injectable } from '@angular/core'
import {  AuthApiService } from '../../../core/services/api'
import { tap } from 'rxjs'
import {  StorageService } from '../../../core/services/storage.service'
import {  Router } from '@angular/router'
import {  UserService } from '../../user/services/user.service'
import { jwtDecode } from 'jwt-decode'

interface LoginI {
  email: string
  password: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor (
    private readonly authApiService: AuthApiService,
    private readonly storageService: StorageService,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly socketStatusService: SocketStatusService
  ) {}

  login (data: LoginI) {
    this.authApiService
      .login(data)
      .pipe(tap((user) => { this.storageService.setItem('jwtToken', user.token) }))
      .subscribe({
        next: (data) => {
          console.log('joderr')
          this.userService.fetchCurrentUserData(data.id).subscribe()
          this.router.navigate(['chats'])
        },
        error (err) {
          console.warn(err)
        }
      })
  }

  isAuthenticated (): boolean {
    const jwtToken = this.storageService.getItem('jwtToken')?.data as string

    if (!jwtToken) return false

    try {
      const decodedToken: { id: string } = jwtDecode(jwtToken)
      this.userService.fetchCurrentUserData(decodedToken.id).subscribe()
      this.socketStatusService.connect(jwtToken)

      return true
    } catch (error) {
      console.error('Error decoding token:', error)
      return false
    }
  }

  logOut () {
    this.storageService.clear()
    this.router.navigate(['auth/login'])
    this.socketStatusService.disconnect()
  }
}
