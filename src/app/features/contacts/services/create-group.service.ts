import { ContactApiService } from './../../../core/services/api/contact-api.service';
import { Injectable, signal } from '@angular/core';
import { IUser } from '../../../shared/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class CreateGroupService {
  public showCreateGroupView = signal(true);
  public userContacts = signal<IUser[]>([]);

  constructor(private readonly contactApiService: ContactApiService) {}

  geUserContacts() {
    this.contactApiService
      .getApiContacts()
      .subscribe((contacts) => this.userContacts.set(contacts));
  }
}
