import { Component, Input } from '@angular/core'

@Component({
  selector: 'shared-start-icon',
  standalone: false,
  templateUrl: './start-icon.component.html',
  styles: ''
})
export class StartIconComponent {
  @Input()iconColor: string = '#8CAEA6'

}
