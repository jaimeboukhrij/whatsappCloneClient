import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-emojy-icon',
  standalone: false,

  templateUrl: './emojy-icon.component.html',
  styles: ``,
})
export class EmojyIconComponent {
  @Input() iconColor = '#8696A0';
}
