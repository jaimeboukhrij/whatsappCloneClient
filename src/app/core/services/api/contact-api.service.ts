import { type HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { type ApiService } from './api.service'
import { type IUser } from '../../../shared/interfaces/user.interface'

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  constructor (
    private readonly http: HttpClient,
    private readonly apiService: ApiService
  ) {}

  getApiContacts () {
    return this.apiService.fetchApi<IUser[]>('/contacts')
  }
}
