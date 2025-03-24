import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-contacts-icon',
  standalone: false,

  templateUrl: './contacts-icon.component.html',
  styles: ``,
})
export class ContactsIconComponent {
  @Input() iconColor = '#8696A0';
}
