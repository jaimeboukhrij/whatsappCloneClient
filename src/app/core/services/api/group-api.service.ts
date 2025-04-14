import {  GroupI } from '../../../modules/groups/interfaces/group.interface'
import { Injectable } from '@angular/core'
import {  ApiService } from './api.service'

interface UpdateGroupDto {
  name: string
  members: string[]
}

@Injectable({ providedIn: 'root' })
export class GroupApiService {
  constructor (private readonly apiService: ApiService) {}

  createGroup (data: FormData) {
    return this.apiService.fetchApi<GroupI>('/groups', data, 'POST', true)
  }

  updateGroup (groupId: string, updateGroupDto: UpdateGroupDto) {
    return this.apiService.fetchApi<GroupI>(`/groups/${groupId}`, updateGroupDto, 'PATCH')
  }
}
