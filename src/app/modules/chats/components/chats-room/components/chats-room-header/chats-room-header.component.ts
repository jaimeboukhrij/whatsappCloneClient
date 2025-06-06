import { Component, inject,  OnInit, signal } from '@angular/core'
import { ChatsRoomService } from '../../services/chats-room.service'

@Component({
  selector: 'chats-room-header',
  standalone: false,

  templateUrl: './chats-room-header.component.html',
  styles: ''
})
export class ChatsRoomHeaderComponent implements OnInit {
  private readonly chatsRoomService = inject(ChatsRoomService)
  public chatRoomData = this.chatsRoomService.currentChatRoomData
  public isOnline = signal(false)
  public isWriting = signal(false)

  ngOnInit (): void {
    this.chatsRoomService.onlineUsers$.subscribe((onlineUsers) => {
      if (this.chatRoomData()!.contactUserId) {
        this.isOnline.set(onlineUsers.includes(this.chatRoomData()!.contactUserId ?? ''))
      }
    })

    this.chatsRoomService.writingUsers$.subscribe(writingData =>{
      if (this.chatRoomData()!.contactUserId) {
        const contactUserId = this.chatRoomData()!.contactUserId ?? ''
        const currentChatRoomId = this.chatRoomData()?.id
        const isWriting = writingData.some(({ chatRoomId, userID })=> chatRoomId === currentChatRoomId && userID === contactUserId )
        this.isWriting.set(isWriting)
      }
    })
  }
}
