import { Component, EventEmitter, Input, Output, signal } from '@angular/core'

@Component({
  selector: 'chat-preview-options',
  standalone: false,
  templateUrl: './chat-preview-options.component.html',
  styleUrl: 'chat-preview-options.component.css'
})
export class ChatPreviewOptionsComponent {
  _show = signal(false)
  @Input()  options: Array<{ id: string, name: string }> = []
  @Output() onClickEmit = new EventEmitter()

  async onClickOptions (id: string, event: MouseEvent) {
    this.onClickEmit.emit({ id, event })
  }


}
