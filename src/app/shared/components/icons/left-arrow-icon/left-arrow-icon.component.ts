import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-left-arrow-icon',
  standalone: false,

  templateUrl: './left-arrow-icon.component.html',
  styles: ``,
})
export class LeftArrowIconComponent {
  @Input() iconColor = '#04A784';
  @Input() arrowDirection: 'left' | 'right' | 'up' | 'down' = 'left';

  getRotation(): string {
    switch (this.arrowDirection) {
      case 'right':
        return 'rotate(180deg)';
      case 'down':
        return 'rotate(270deg)';
      case 'up':
        return 'rotate(90deg)';
      case 'left':
      default:
        return 'rotate(0deg)';
    }
  }
}
