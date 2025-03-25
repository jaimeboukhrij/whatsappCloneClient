import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { ContactsHeaderComponent } from './components/contacts-header/contacts-header.component';
import { ContactsComponent } from './contacts.component';
import { ContactsPreviewComponent } from './components/contacts-preview/contacts-preview.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { AddNewContactModalComponent } from './components/add-new-contact-modal/add-new-contact-modal.component';

@NgModule({
  declarations: [
    ContactsComponent,
    ContactsHeaderComponent,
    ContactsPreviewComponent,
    AddNewContactModalComponent,
  ],
  imports: [CommonModule, ContactsRoutingModule, SharedModule],
})
export class ContactsModule {}
