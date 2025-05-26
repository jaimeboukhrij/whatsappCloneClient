import { Component, Input } from '@angular/core'

@Component({
  selector: 'shared-forward-icon',
  standalone: false,
  templateUrl: './forward-icon.component.html'

})
export class ForwardIconComponent {
  @Input() iconColor = '#8696A0'
}
