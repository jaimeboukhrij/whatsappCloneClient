import { Component, Input } from '@angular/core'

@Component({
  selector: 'shared-trush-icon',
  standalone: false,
  templateUrl: './trush-icon.component.html',
  styles: ''
})
export class TrushIconComponent {
  @Input() iconColor = '#8696A0'

}
