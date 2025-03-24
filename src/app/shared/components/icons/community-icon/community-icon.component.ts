import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-community-icon',
  standalone: false,

  templateUrl: './community-icon.component.html',
  styles: ``,
})
export class CommunityIconComponent {
  @Input() iconColor = '';
}
