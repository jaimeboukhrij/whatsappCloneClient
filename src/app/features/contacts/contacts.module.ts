import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactsRoutingModule } from './contacts-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ContactsHeaderComponent } from './components/contacts-header/contacts-header.component';
import { ContactsComponent } from './contacts.component';
import { ContactsPreviewComponent } from './components/contacts-preview/contacts-preview.component';

@NgModule({
  declarations: [
    ContactsComponent,
    ContactsHeaderComponent,
    ContactsPreviewComponent,
  ],
  imports: [CommonModule, ContactsRoutingModule, SharedModule],
})
export class ContactsModule {}
