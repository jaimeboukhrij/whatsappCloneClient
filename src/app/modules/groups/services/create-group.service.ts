import { Injectable, signal } from '@angular/core';
import { GroupApiService } from '../../../core/services/api';

@Injectable({ providedIn: 'root' })
export class CreateGroupService {
  public showCreateGroupView = signal(false);

  constructor(private readonly groupsApiService: GroupApiService) {}

  createGroup(data: FormData) {
    this.groupsApiService
      .createGroup(data)
      .subscribe((data) => console.log(data));
  }
}
