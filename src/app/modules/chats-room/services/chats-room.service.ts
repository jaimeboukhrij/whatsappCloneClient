import { Injectable, signal,  WritableSignal } from '@angular/core'
import {  ChatApiService } from '../../../core/services/api'
import {  ChatI } from '../../chats/model'

import {  SocketStatusService } from '../../../core/services/socket/socket-status.service'
import { BehaviorSubject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ChatsRoomService {
  currentChatRoomId = signal('')
  currentChatRoomData: WritableSignal<ChatI | null> = signal(null)
  onlineUsersSubject = new BehaviorSubject<string[]>([])
  onlineUsers$ = this.onlineUsersSubject.asObservable()

  constructor (
    private readonly chatApiService: ChatApiService,
    private readonly socketStatusService: SocketStatusService
  ) {}

  showChatRoomData (id: string) {
    if (id !== this.currentChatRoomId()) this.currentChatRoomData.set(null)
    this.chatApiService.findOneChat(id).subscribe({
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
