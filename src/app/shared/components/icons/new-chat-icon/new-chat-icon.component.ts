import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-new-chat-icon',
  standalone: false,

  templateUrl: './new-chat-icon.component.html',
  styles: ``,
})
export class NewChatIconComponent {
  @Input() iconColor: string = '';
}
