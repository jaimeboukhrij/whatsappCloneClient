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
  writingUsersSubject = new BehaviorSubject<string[]>([])
  writingUsers$ = this.writingUsersSubject.asObservable()
  private  writingTimeout: ReturnType<typeof setTimeout> | null = null
  public isLoading = signal(false)

  constructor (
    private readonly chatRoomApiService: ChatRoomApiService,
    private readonly socketStatusService: SocketStatusService,
    private readonly chatService: ChatService
  ) {

  }

  changeChatRoomData (id: string) {
    this.currentChatRoomId.set(id)
    this.updateChatRoomData()
  }

  updateChatRoomData () {
    this.isLoading.set(true)
    const id = this.currentChatRoomId()
    const chats = this.chatService.chats()
    const foundChat = chats.find(chat => chat.id === id)
    if (foundChat) this.currentChatRoomData.set(foundChat)
    setTimeout(() => {
      this.isLoading.set(false)
    }, 0)
  }



  handleUserIswriting () {
    this.socketStatusService.emit('writing-from-client', true)

    if (this.writingTimeout) {
      clearTimeout(this.writingTimeout)
    }

    this.writingTimeout = setTimeout(() => {
      this.socketStatusService.emit('writing-from-client', false)
      this.writingTimeout = null
    }, 1000)
  }


  usersOnlineSocket () {
    this.socketStatusService.on('users-online-updated', (uids: string[]) => {
      this.chatService.getChats()
      this.onlineUsersSubject.next(uids)
    })
  }

  usersWritingSocket () {
    this.socketStatusService.on('writing-from-server', (uids: string[]) => {
      this.writingUsersSubject.next(uids)
    })
  }
}

