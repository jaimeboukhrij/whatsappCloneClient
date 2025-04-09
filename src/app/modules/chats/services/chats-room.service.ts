import { Injectable, signal,  WritableSignal } from '@angular/core'
import {  ChatRoomApiService } from '../../../core/services/api'
import {  ChatI } from '../../chats/model'

import {  SocketStatusService } from '../../../core/services/socket/socket-status.service'
import { BehaviorSubject } from 'rxjs'
import { ChatService } from './chat.service'

@Injectable({ providedIn: 'root' })
export class ChatsRoomService {
  currentChatRoomId = signal('')
  currentChatRoomData: WritableSignal<ChatI | null> = signal(null)
  onlineUsersSubject = new BehaviorSubject<string[]>([])
  onlineUsers$ = this.onlineUsersSubject.asObservable()

  constructor (
    private readonly chatRoomApiService: ChatRoomApiService,
    private readonly socketStatusService: SocketStatusService,
    private readonly chatService: ChatService
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


}
