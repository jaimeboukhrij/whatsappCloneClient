import {
  Component,
  AfterViewChecked,
  HostListener,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  signal,
  inject,
  EventEmitter,
  Output,
  Input
} from '@angular/core'
import 'emoji-picker-element'
import { UtilsService } from '../../../core/services/utils.service'

@Component({
  selector: 'shared-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.css',
  standalone: false
})
export class EmojiPickerComponent implements AfterViewChecked {
  private readonly utilsService = inject(UtilsService)
  public showEmojis = signal(false)

  @ViewChild('emojiPicker', { static: false }) emojiPickerElement!: ElementRef
  @Input() public emojiPickerData = signal(
    {
      width: 0,
      height: 0,
      x: 0,
      y: 0 }
  )

  @Output() public emitEmoji = new EventEmitter<string>()
  @Output() public openEmojiPicker = new EventEmitter<Event>()

  constructor (private readonly cdRef: ChangeDetectorRef) {}

  ngAfterViewChecked (): void {
    this.cdRef.detectChanges()
    if (this.emojiPickerElement) {
      const picker = this.emojiPickerElement.nativeElement
      picker?.addEventListener('emoji-click', this.onEmojiClick)
    }
  }

  onEmojiClick = (event: Event): void => {
    const customEvent = event as CustomEvent
    const emoji: string = customEvent.detail.unicode
    this.emitEmoji.emit(emoji)
  }

  setShowEmoji (event?: Event) {
    if (event) {
      event.stopPropagation()
    }

    if (event && !this.showEmojis()) {
      this.openEmojiPicker.emit(event)
    }

    this.showEmojis.update((prev) => !prev)

  }


  private getOptionsPosition (event: Event) {
    const coordinates = this.utilsService.getCoordinates(event as MouseEvent)
    return coordinates
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick (event: MouseEvent): void {
    if (
      this.emojiPickerElement &&
      !this.emojiPickerElement.nativeElement.contains(event.target as Node)
    ) {
      if (this.showEmojis()) {
        this.showEmojis.set(false)
      }
    }
  }


}
