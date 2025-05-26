import {  Component, HostListener, OnInit, signal } from '@angular/core'
import { ChatStarredMessagesService } from './services/chat-starred-messages.service'
import { ChatService } from '../../services/chats.service'
import { ChatsRoomService } from '../chats-room/services/chats-room.service'


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
  starredMessagesViewData




  constructor (private readonly chatStarredMessagesService: ChatStarredMessagesService,
    private readonly chatService: ChatService,
    private readonly chatsRoomService: ChatsRoomService

  ) {
    this.chatStarredHeaderOptions = this.chatStarredMessagesService.chatStarredHeaderOptions
    this.showStarredMessages = this.chatService.showStarredMessages
    this.starredMessagesViewData = this.chatStarredMessagesService.starredMessagesViewData

  }

  ngOnInit (): void {
    this.chatStarredMessagesService.getUserStarredMessages()
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
    const currentChatRoomId = this.chatsRoomService.currentChatRoomId()
    if (currentChatRoomId === chatRoomId) {
      this.chatsRoomService.scrollToMessage.set(starredMessageId)
      return
    }
    this.chatsRoomService.changeChatRoomData(chatRoomId)?.subscribe({
      next: ()=>{
        this.chatsRoomService.scrollToMessage.set(starredMessageId)
      }
    })

  }

  @HostListener('document:click', ['$event'])
  onClickOutside (event: Event) {
    if (!this.showOptions()) return
    this.showOptions.set(false)
  }


}
