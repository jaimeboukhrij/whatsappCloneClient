import { Injectable,  WritableSignal, signal } from '@angular/core'
import {  UserApiService } from '../../../core/services/api'
import {  IUser } from '../../../shared/interfaces/user.interface'
import { UpdateUserDtoI } from '../interfaces/update-user.dto'
import { lastValueFrom, tap } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly currentUserData: WritableSignal<IUser | null> = signal(null)

  constructor (private readonly userApiService: UserApiService) {}

  fetchCurrentUserData (userId: string) {
    return this.userApiService.getApiUsersFindOne(userId).pipe(
      tap({
        next: (data: IUser) => {
          this.currentUserData.set(data)
        },
        error: (err: any) => {
          console.log('error al hacer fetchCurrentUserData', err)
        }
      })
    )
  }


  updateUser (userId: string, updateUser: Partial<UpdateUserDtoI>) {
    return this.userApiService.updateApiUser(userId, updateUser)
  }

  get loginUserData () {
    return this.currentUserData
  }

  async getUpdatedLoginUserData (): Promise<IUser | null> {
    const currentUserId = this.currentUserData()?.id
    if (!currentUserId) return null

    await lastValueFrom(this.fetchCurrentUserData(currentUserId))
    return this.currentUserData()
  }
}
