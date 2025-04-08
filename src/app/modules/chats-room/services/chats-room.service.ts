import { Injectable, signal, type WritableSignal } from '@angular/core'
import { type ChatRoomApiService } from '../../../core/services/api'
import { type ChatRoomI } from '../../chats/model'

import { type SocketStatusService } from '../../../core/services/socket/socket-status.service'
import { BehaviorSubject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ChatsRoomService {
  currentChatRoomId = signal('')
  currentChatRoomData: WritableSignal<ChatRoomI | null> = signal(null)
  onlineUsersSubject = new BehaviorSubject<string[]>([])
  onlineUsers$ = this.onlineUsersSubject.asObservable()

  constructor (
    private readonly chatRoomApiService: ChatRoomApiService,
    private readonly socketStatusService: SocketStatusService
  ) {}

  showChatRoomData (id: string) {
    if (id !== this.currentChatRoomId()) this.currentChatRoomData.set(null)
    this.chatRoomApiService.findOneChatRoom(id).subscribe({
      next: (data) => {
        this.currentChatRoomData.set(data)
        this.currentChatRoomId.set(data.id)
      }
    })
  }

  usersLastSeenSocket () {
    this.socketStatusService.on('users-last-seen', () => {
      this.showChatRoomData(this.currentChatRoomId())
    })
  }

  usersOnlineSocket () {
    this.socketStatusService.on('users-online-updated', (uids: string[]) => {
      this.onlineUsersSubject.next(uids)
    })
  }

  // newMessageSocket() {
  //   this.socketStatusService.em('new-message', (uids: string[]) => {
  //     this.onlineUsersSubject.next(uids);
  //   });
  // }
}
