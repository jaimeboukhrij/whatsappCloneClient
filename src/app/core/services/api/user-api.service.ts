import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IUser } from '../../../shared/interfaces/user.interface';
import { ChatRoomI } from '../../../modules/chats/model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiService: ApiService
  ) {}

  getApiUsers() {
    return this.apiService.fetchApi<IUser[]>('/users');
  }

  getApiUsersFindOne(userId: string) {
    return this.apiService.fetchApi<IUser>(`/users/${userId}`);
  }

  getApiUsersByUserName(query: string) {
    return this.apiService.fetchApi<IUser[]>(
      `/users/search-by-username?prefix=${query}`
    );
  }

  getUserChatsRoom() {
    return this.apiService.fetchApi<ChatRoomI[]>('/users/chats-room');
  }

  getUsersRecommended() {
    return this.apiService.fetchApi<IUser[]>('/users/recommended');
  }
}
