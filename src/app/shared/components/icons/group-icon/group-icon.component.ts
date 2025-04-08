import { Component, Input } from '@angular/core'

@Component({
  selector: 'shared-group-icon',
  standalone: false,

  templateUrl: './group-icon.component.html',
  styles: ''
})
export class GroupIconComponent {
  @Input() iconColor = '#8696A0'
}
