import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-plus-icon',
  standalone: false,

  templateUrl: './plus-icon.component.html',
  styles: ``,
})
export class PlusIconComponent {
  @Input() iconColor = '#8696A0';
}
