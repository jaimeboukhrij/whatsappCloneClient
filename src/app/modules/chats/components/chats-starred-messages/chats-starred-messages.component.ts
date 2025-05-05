import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, signal, ViewChildren } from '@angular/core'
import { ChatStarredMessagesService } from './services/chat-starred-messages.service'
import { ChatService } from '../../services/chats.service'
import { UserService } from '../../../user/services/user.service'
import { ChatStarredMessagesViewI } from './interfaces/chat-starred-messages.interface'
import { ChatsRoomService } from '../chats-room/services/chats-room.service'


@Component({
  selector: 'chats-starred-messages',
  standalone: false,
  templateUrl: './chats-starred-messages.component.html',
  styleUrl: './chats-starred-messages.component.css'
})
export class ChatsStarredMessagesComponent implements OnInit, AfterViewInit {
  chatHeaderOptionsCordenates = signal({ x: -7, y: 40 })
  showOptions = signal(false)
  chatStarredHeaderOptions
  showStarredMessages
  starredMessagesViewData = signal<ChatStarredMessagesViewI[]>([])

  @ViewChildren('messageRef', { read: ElementRef }) messageElems!: QueryList<ElementRef>


  constructor (private readonly chatStarredMessagesService: ChatStarredMessagesService,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly chatsRoomService: ChatsRoomService

  ) {
    this.chatStarredHeaderOptions = this.chatStarredMessagesService.chatStarredHeaderOptions
    this.showStarredMessages = this.chatService.showStarredMessages

  }


  ngAfterViewInit (): void {
    // this.messageElems.changes.subscribe((elems: QueryList<ElementRef>) => {
    //   elems.forEach((elem: ElementRef<HTMLElement>) => {
    //     const children: HTMLCollection = elem.nativeElement.children

    //     Array.from(children).forEach((child: Element) => {
    //       const attr: string | null = child.getAttribute('data-message-id')

    //       if(attr === )
    //       console.log('Atributo del hijo:', attr)
    //     })
    //   })
    // })
  }




  scrollToMessage (messageId: string) {
    setTimeout(() => {
      this.messageElems.forEach((elem: ElementRef<HTMLElement>) => {
        const children: HTMLCollection = elem.nativeElement.children

        Array.from(children).forEach((child: Element) => {
          const attr: string | null = child.getAttribute('data-message-id')

          if (attr === messageId) {
            console.log('dentroooo')
            child.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        })
      })
    }, 0)
  }



  ngOnInit (): void {
    this.getUserStarredMessages()
  }


  private getUserStarredMessages () {
    this.userService.getUserStarredMessages()
      .subscribe({
        next: (starredMessages) => {
          const starredMessagesViewData = this.chatStarredMessagesService.getStarredMessagesViewData(starredMessages)
          this.starredMessagesViewData.set(starredMessagesViewData)
        }
      })
  }


  onClickback () {
    this.showStarredMessages.set(false)
  }

  onOptionClick (data: { id: string, event: Event }) {

  }

  onOptionsIconClick (event: Event) {
    event.stopPropagation()
    this.showOptions.update(prev => !prev)
  }

  onStarredMessageClick (chatRoomId: string, starredMessageId: string) {
    this.chatsRoomService.changeChatRoomData(chatRoomId)?.subscribe({
      next: ()=>{ this.scrollToMessage(starredMessageId) }
    })

  }

  @HostListener('document:click', ['$event'])
  onClickOutside (event: Event) {
    if (!this.showOptions()) return
    this.showOptions.set(false)
  }


}
