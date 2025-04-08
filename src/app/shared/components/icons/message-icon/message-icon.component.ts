import { Component, Input } from '@angular/core'

@Component({
  selector: 'shared-message-icon',
  standalone: false,

  templateUrl: './message-icon.component.html'
})
export class MessageIconComponent {
  @Input() iconColor = '#8696A0'
}
