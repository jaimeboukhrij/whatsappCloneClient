import { Component, Input } from '@angular/core'

@Component({
  selector: 'icon-state',
  standalone: false,

  templateUrl: './state-icon.component.html',
  styles: ''
})
export class StateIconComponent {
  @Input()iconColor: string = ''

}
