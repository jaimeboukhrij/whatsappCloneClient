import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-micro-icon',
  standalone: false,

  templateUrl: './micro-icon.component.html',
  styles: ``,
})
export class MicroIconComponent {
  @Input() iconColor = '#8696A0';
}
