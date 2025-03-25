import { Component, Input } from '@angular/core';
import { IUser } from '../../../../shared/interfaces/user.interface';

@Component({
  selector: 'contacts-preview',
  templateUrl: './contacts-preview.component.html',
  standalone: false,
})
export class ContactsPreviewComponent {
  @Input() public contactsData: IUser = {} as IUser;
  @Input() public title: string | undefined = undefined;
}
