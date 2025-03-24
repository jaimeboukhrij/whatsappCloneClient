import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-dbcheck',
  standalone: false,

  templateUrl: './dbcheck-icon.component.html',
  styles: ``,
})
export class DbcheckIconComponent {
  @Input() iconColor = '#8696A0';
}
