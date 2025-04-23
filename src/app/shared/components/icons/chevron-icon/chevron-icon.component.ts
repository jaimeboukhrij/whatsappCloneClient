import { Component, Input } from '@angular/core'

@Component({
  selector: 'shared-chevron-icon',
  standalone: false,

  templateUrl: './chevron-icon.component.html',
  styles: ''
})
export class ChevronIconComponent {
  @Input() iconColor = '#8696A0'
  @Input() arrowDirection: 'left' | 'right' | 'up' | 'down' = 'down'
  @Input() measure = { width: '30', height: '30' }

  getRotation (): string {
    switch (this.arrowDirection) {
      case 'right':
        return 'rotate(0deg)'
      case 'down':
        return 'rotate(90deg)'
      case 'up':
        return 'rotate(270deg)'
      case 'left':
      default:
        return 'rotate(180deg)'
    }
  }
}
