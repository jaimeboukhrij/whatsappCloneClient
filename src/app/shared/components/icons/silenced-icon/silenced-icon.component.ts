import { Component, Input } from '@angular/core'

@Component({
  selector: 'shared-silenced-icon',
  standalone: false,

  templateUrl: './silenced-icon.component.html',
  styles: ''
})
export class SilencedIconComponent {
  @Input() iconColor = '#8696A0'
}
