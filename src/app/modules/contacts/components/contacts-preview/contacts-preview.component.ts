import { Component, inject, Input } from '@angular/core';
import { IUser } from '../../../../shared/interfaces/user.interface';
import { ContactsService } from '../../services';

@Component({
  selector: 'contacts-preview',
  templateUrl: './contacts-preview.component.html',
  standalone: false,
})
export class ContactsPreviewComponent {
  private contactsService = inject(ContactsService);

  @Input() public contactsData: IUser = {} as IUser;
  @Input() public title: string | undefined = undefined;

  onClickContact() {
    this.contactsService.createChatRoom(this.contactsData.id, 'private');
  }
}
