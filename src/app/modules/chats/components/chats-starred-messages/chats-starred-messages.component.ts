import { Component, HostListener, OnInit, signal } from '@angular/core'
import { ChatStarredMessagesService } from './services/chat-starred-messages.service'
import { ChatService } from '../../services/chats.service'
import { UserService } from '../../../user/services/user.service'
import { ChatPreviewMessagesDataI } from '../chat-preview/interfaces/chat-preview.interface'


@Component({
  selector: 'chats-starred-messages',
  standalone: false,
  templateUrl: './chats-starred-messages.component.html',
  styleUrl: './chats-starred-messages.component.css'
})
export class ChatsStarredMessagesComponent implements OnInit {
  chatHeaderOptionsCordenates = signal({ x: -7, y: 40 })
  showOptions = signal(false)
  chatStarredHeaderOptions
  showStarredMessages
  public userStarredMessagesData = signal<ChatPreviewMessagesDataI | []>([])



  constructor (private readonly chatStarredMessagesService: ChatStarredMessagesService,
    private readonly chatService: ChatService,
    private readonly userService: UserService

  ) {
    this.chatStarredHeaderOptions = this.chatStarredMessagesService.chatStarredHeaderOptions
    this.showStarredMessages = this.chatService.showStarredMessages

  }




  ngOnInit (): void {
    this.getUserStarredMessages()
  }


  private getUserStarredMessages () {
    this.userService.getUserStarredMessages()
      .subscribe({
        next: (starredMessages) => {

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

  @HostListener('document:click', ['$event'])
  onClickOutside (event: Event) {
    if (!this.showOptions()) return
    this.showOptions.set(false)
  }


}
