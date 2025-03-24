import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-chat',
  standalone: false,

  templateUrl: './chat-icon.component.html',
})
export class ChatIconComponent {
  @Input()iconColor:string = ''
}
