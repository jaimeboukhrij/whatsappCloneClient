import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { ContactsService } from './services/contacts.service';
import { AddNewcontactService } from './services/add-new-contact.service';
import { CreateGroupService } from './services';

@Component({
  standalone: false,
  templateUrl: './contacts.component.html',
})
export class ContactsComponent implements OnInit {
  private contactsService = inject(ContactsService);
  private readonly addNewcontactService = inject(AddNewcontactService);
  private readonly createGroupService = inject(CreateGroupService);

  public contactsSortedByLetterData = this.contactsService.contactsData;
  public isChatInputLoading = this.contactsService.isChatInputLoading;
  public showNewContactModal: WritableSignal<boolean>;
  public showCreateGroupView: WritableSignal<boolean>;

  constructor() {
    this.showNewContactModal = this.addNewcontactService.showNewContactModal;
    this.showCreateGroupView = this.createGroupService.showCreateGroupView;
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
