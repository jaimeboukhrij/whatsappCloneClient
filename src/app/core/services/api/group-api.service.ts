import { type GroupI } from '../../../modules/groups/interfaces/group.interface'
import { Injectable } from '@angular/core'
import { type ApiService } from './api.service'

@Injectable({ providedIn: 'root' })
export class GroupApiService {
  constructor (private readonly apiService: ApiService) {}

  createGroup (data: FormData) {
    return this.apiService.fetchApi<GroupI>('/groups', data, 'POST', true)
  }
}
