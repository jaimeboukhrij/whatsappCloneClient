import { Component, effect, ElementRef, inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { ChatRoomMessageI } from '../../interfaces/chat-room-messages.interface'
import { ChatRoomMessagesService } from '../chats-room-messages/services/chats-room-messages.service'
import { WritableSignal } from '@angular/core'
import { ChatsRoomService } from '../../services/chats-room.service'

@Component({
  selector: 'chats-room-body',
  standalone: false,
  templateUrl: './chats-room-body.component.html'
})
export class ChatsRoomBodyComponent implements OnInit, OnDestroy {


  private readonly chatRoomMessagesService = inject(ChatRoomMessagesService)
  private readonly chatsRoomService = inject(ChatsRoomService)
  public messages: WritableSignal<ChatRoomMessageI[]> = this.chatRoomMessagesService.chatRoomMessages
  private shouldScroll = true
  public scrollToMessage = this.chatsRoomService.scrollToMessage



  @ViewChild('scrollContainer') private readonly scrollContainer!: ElementRef<HTMLDivElement>
  @ViewChildren('messageRef', { read: ElementRef }) messageElems!: QueryList<ElementRef>


  constructor () {
    effect(()=>{

      const messageId = this.scrollToMessage()
      if (messageId) {
        this.scrollToMessageEffect(messageId)
      }
    })
  }

  ngOnDestroy (): void {
    this.chatsRoomService.scrollToMessage.set(null)
  }

  ngOnInit (): void {
    this.chatRoomMessagesService.scrollBottomChatRoom$.subscribe((shouldScroll: boolean)=>{
      if (!shouldScroll) return
      this.shouldScroll = true
      this.scrollToBottom()
    })

  }

  ngAfterViewChecked (): void {
    if (this.shouldScroll) {
      this.scrollToBottom()
    }
  }

  scrollToMessageEffect (messageId: string) {
    setTimeout(() => {
      this.messageElems.forEach((elem: ElementRef<HTMLElement>) => {
        const children: HTMLCollection = elem.nativeElement.children

        Array.from(children).forEach((child: Element) => {
          const attr: string | null = child.getAttribute('data-message-id')

          if (attr === messageId) {
            child.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        })
      })
    }, 0)
  }

  private scrollToBottom (): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
      this.shouldScroll = false
    }
  }





}
