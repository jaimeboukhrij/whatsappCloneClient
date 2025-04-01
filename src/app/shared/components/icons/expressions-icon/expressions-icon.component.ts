import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-expressions-icon',
  standalone: false,

  templateUrl: './expressions-icon.component.html',
  styles: ``,
})
export class ExpressionsIconComponent {
  @Input() iconColor = '#8696A0';
}
