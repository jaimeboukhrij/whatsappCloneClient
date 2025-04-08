import { Injectable } from '@angular/core'
import { type ApiService } from './api.service'
import { type IUser } from '../../../shared/interfaces/user.interface'

interface LoginI {
  email: string
  password: string
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor (private readonly apiService: ApiService) {}
  login (data: LoginI) {
    return this.apiService.fetchApi<IUser>('/auth/login', data, 'POST')
  }
}
