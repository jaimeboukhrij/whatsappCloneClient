import { Injectable, signal,  WritableSignal } from '@angular/core'

import { BehaviorSubject, Observable, tap } from 'rxjs'
import { ChatRoomApiService } from '../../../../../core/services/api'
import { SocketStatusService } from '../../../../../core/services/socket/socket-status.service'
import { ChatI } from '../../../model'
import { ChatService } from '../../../services/chats.service'
import { UpdateChatRoomDto } from '../interfaces/update-chat-room-dto'
import { CreateChatRoomDto } from '../interfaces'


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

  public async deleteChatRoom (id: string, newChats: ChatI[]) {
    const prevChats = this.chatService.chats()
    this.chatService.chats.set(newChats)

    this.chatRoomApiService.deleteChatRoom(id).subscribe({
      next: () => {
        this.chatService.getChats().subscribe()
      },
      error: (error) => {
        this.chatService.chats.set(prevChats)
        console.log(error)
      }
    })
  }

  findOneChatRoom (chatId: string) {
    return this.chatRoomApiService.findOneChatRoom(chatId)
  }


  public updateChatRoom (id: string, data: Partial<UpdateChatRoomDto>, newChats?: ChatI[]): Observable<any> {

    const prevChats = this.chatService.chats()
    // if (newChats?.length) this.chatService.chats.set(newChats)

    return this.chatRoomApiService.updateChatRoom(id, data).pipe(
      tap({
        next: () => this.chatService.getChats().subscribe(),
        error: () => { this.chatService.chats.set(prevChats) }
      })
    )
  }





  createChatRoom (createChatRoomDto: CreateChatRoomDto): Observable<ChatI> {
    return this.chatRoomApiService.createChatRoom(createChatRoomDto)
  }

  changeChatRoomData (id: string | null) {
    if (!id) {
      this.currentChatRoomData.set(null)
      return
    }
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
    }, 1)
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

  getChatRoomByContactUserId (contactId: string) {
    return this.chatRoomApiService.getChatRoomByContactUserId(contactId)
  }


  usersOnlineSocket () {
    this.socketStatusService.on('users-online-updated', (uids: string[]) => {
      this.chatService.getChats().subscribe()
      this.onlineUsersSubject.next(uids)
    })
  }

  usersWritingSocket () {
    this.socketStatusService.on('writing-from-server', (uids: string[]) => {
      this.writingUsersSubject.next(uids)
    })
  }
}

