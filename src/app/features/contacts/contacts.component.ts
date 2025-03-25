import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { ContactsService } from './services/contacts.service';
import { UserApiService } from '../../core/services/api';
import { AddNewcontactService } from './services/add-new-contact.service';

@Component({
  standalone: false,
  templateUrl: './contacts.component.html',
})
export class ContactsComponent implements OnInit {
  private contactsService = inject(ContactsService);
  private userApiService = inject(UserApiService);
  private readonly addNewcontactService = inject(AddNewcontactService);

  public contactsSortedByLetterData = this.contactsService.contactsData;
  public isChatInputLoading = this.contactsService.isChatInputLoading;
  public showNewContactModal: WritableSignal<boolean>;

  constructor() {
    this.showNewContactModal = this.addNewcontactService.showNewContactModal;
  }

  ngOnInit(): void {
    this.contactsService.getContactsData();
  }

  onInputQueryChange(query: string) {
    this.contactsService.onInputQueryChange(query);
  }
  onClickAddNewUser() {
    this.showNewContactModal.set(true);
  }
}
