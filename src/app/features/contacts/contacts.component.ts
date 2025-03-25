import { Component, inject, OnInit } from '@angular/core';
import { ContactsService } from './services/contacts.service';
import { UserApiService } from '../../core/services/api';

@Component({
  standalone: false,
  templateUrl: './contacts.component.html',
})
export class ContactsComponent implements OnInit {
  private contactsService = inject(ContactsService);
  private userApiService = inject(UserApiService);

  public contactsSortedByLetterData = this.contactsService.contactsData;
  public isChatInputLoading = this.contactsService.isChatInputLoading;

  ngOnInit(): void {
    this.contactsService.getContactsData();
  }

  onInputQueryChange(query: string) {
    this.contactsService.onInputQueryChange(query);
  }
}
