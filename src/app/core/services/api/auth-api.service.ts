import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IUser } from '../../interfaces/user.interface';

interface LoginI {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly apiService: ApiService) {}
  login(data: LoginI) {
    return this.apiService.fetchApi<IUser>('/auth/login', data, 'POST');
  }
}
