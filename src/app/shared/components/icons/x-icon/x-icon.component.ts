import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-x-icon',
  standalone: false,

  templateUrl: './x-icon.component.html',
  styles: ``,
})
export class XIconComponent {
  @Input() iconColor: string = '#8696A0';
}
