import { Component, Input } from '@angular/core'

@Component({
  selector: 'chat-button',
  standalone: false,

  templateUrl: './chat-button.component.html',
  styles: ''
})
export class ChatButtonComponent {
  @Input() buttonText: string = ''
  @Input() isActive = false
}
