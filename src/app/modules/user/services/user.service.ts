import { Injectable,  WritableSignal, signal } from '@angular/core'
import {  UserApiService } from '../../../core/services/api'
import {  IUser } from '../../../shared/interfaces/user.interface'

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly currentUserData: WritableSignal<IUser | null> = signal(null)

  constructor (private readonly userApiService: UserApiService) {}

  fetchCurrentUserData (userId: string) {
    this.userApiService.getApiUsersFindOne(userId).subscribe({
      next: (data) => {
        this.currentUserData.set(data)
      },
      error (err) {
        console.log(err)
      }
    })
  }

  get loginUserData () {
    return this.currentUserData
  }
}
