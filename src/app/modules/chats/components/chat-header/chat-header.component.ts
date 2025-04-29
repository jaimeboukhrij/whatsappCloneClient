import { Component, HostListener, signal } from '@angular/core'
import {  Router } from '@angular/router'
import { ChatHeaderService } from './services/chat-header.service'

@Component({
  selector: 'chat-header',
  standalone: false,

  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent {
  public iconColor = '#ADBAC1'
  chatHeaderOptionsCordenates = signal({ x: -7, y: 40 })
  showOptions = signal(false)
  chatHeaderOptions
  showCreateGroupView


  constructor (private readonly router: Router,
    private readonly chatHeaderService: ChatHeaderService
  ) {
    this.chatHeaderOptions = this.chatHeaderService.chatHeaderOptions
    this.showCreateGroupView = this.chatHeaderService.showCreateGroupView
  }

  onContactsIconClick () {
    this.router.navigate(['/contacts'])
  }

  onOptionClick (data: { id: string, event: Event }) {
    this.chatHeaderService.onOptionClick(data.id)
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
