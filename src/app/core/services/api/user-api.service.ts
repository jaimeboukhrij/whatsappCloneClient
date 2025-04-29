
import { Injectable } from '@angular/core'
import {  ApiService } from './api.service'
import {  IUser } from '../../../shared/interfaces/user.interface'
import {  ChatI } from '../../../modules/chats/interfaces'
import { UpdateUserDtoI } from '../../../modules/user/interfaces/update-user.dto'
import { ChatRoomMessageI } from '../../../modules/chats/components/chats-room/interfaces'

@Injectable({ providedIn: 'root' })
export class UserApiService {
  constructor (
    private readonly apiService: ApiService
  ) {}

  getApiUsers () {
    return this.apiService.fetchApi<IUser[]>('/users')
  }

  getApiUsersFindOne (userId: string) {
    return this.apiService.fetchApi<IUser>(`/users/${userId}`)
  }

  getApiUsersByUserName (query: string) {
    return this.apiService.fetchApi<IUser[]>(
      `/users/search-by-username?prefix=${query}`
    )
  }

  updateApiUser (userId: string, updateUser: Partial<UpdateUserDtoI>) {
    return this.apiService.fetchApi<IUser>(`/users/${userId}`, updateUser, 'PATCH')
  }

  getUserChats () {
    return this.apiService.fetchApi<ChatI[]>('/users/chats-room')
  }

  getUserStarredMessages () {
    return this.apiService.fetchApi<ChatRoomMessageI[]>('/users/starred-messages')
  }

  getUsersRecommended () {
    return this.apiService.fetchApi<IUser[]>('/users/recommended')
  }
}
