import {
  Component,
  EventEmitter,
  Input,
  type OnInit,
  Output,
  signal
} from '@angular/core'

@Component({
  selector: 'chats-input',
  templateUrl: './chats-input.component.html',
  styles: '',
  standalone: false
})
export class ChatInputComponent implements OnInit {
  public placeHolder = signal('')
  public isFocus = signal(false)
  public query = signal('')

  @Input() public isChatInputLoading = false
  @Input() public defaultPlaceHolder = 'Buscar'
  @Output() public messageEvent = new EventEmitter<string>()

  ngOnInit (): void {
    this.placeHolder.set(this.defaultPlaceHolder)
    this.query.set('')
  }

  onFocus () {
    this.placeHolder.set('')
    this.isFocus.set(true)
  }

  onBlur () {
    this.placeHolder.set(this.defaultPlaceHolder)
    this.isFocus.set(false)
  }

  onChange (event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.query.set(value)
    this.messageEvent.emit(value)
  }

  xOnClick () {
    this.messageEvent.emit('')
    this.query.set('')
  }

  onArrowClick (event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.onBlur()
    this.messageEvent.emit('')
    this.query.set('')
  }
}
