import { Component, Input } from '@angular/core'

@Component({
  selector: 'shared-options-icon',
  standalone: false,

  templateUrl: './options-icon.component.html',
  styles: ''
})
export class OptionsIconComponent {
  @Input() iconColor: string = ''
}
