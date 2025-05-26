import { Component, Input } from '@angular/core'

@Component({
  selector: 'shared-lock-icon',
  standalone: false,
  templateUrl: './lock-icon.component.html',
  styles: ''
})
export class LockIconComponent {
  @Input() iconColor = '#04A784'

}
