import { effect, Injectable, signal,  WritableSignal } from '@angular/core'

import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from 'rxjs'
import { ChatRoomApiService } from '../../../../../core/services/api'
import { SocketStatusService } from '../../../../../core/services/socket/socket-status.service'
import { ChatService } from '../../../services/chats.service'
import { UpdateChatRoomDto } from '../interfaces/chat-room-update.dto'
import { CreateChatRoomDto } from '../interfaces'
import { chatRoomGroupNameColors } from '../../../../../core/constants'
import { ChatFiltersService } from '../../../services/chats-filters.service'
import { ChatFiltersEnum, ChatI } from '../../../interfaces'



@Injectable({ providedIn: 'root' })
export class ChatsRoomService {
  currentChatRoomId = signal('')
  currentChatRoomData: WritableSignal<ChatI | null> = signal(null)
  currentChats: WritableSignal<ChatI[]> = signal([])
  onlineUsersSubject = new BehaviorSubject<string[]>([])
  onlineUsers$ = this.onlineUsersSubject.asObservable()
  writingUsersSubject = new BehaviorSubject< Array<{ userID: string, chatRoomId: string }>>([])
  writingUsers$ = this.writingUsersSubject.asObservable()
  private  writingTimeout: ReturnType<typeof setTimeout> | null = null
  public isLoading = signal(false)
  public nameColors = signal<Map<string, string> | null>(null)

  constructor (
    private readonly chatRoomApiService: ChatRoomApiService,
    private readonly socketStatusService: SocketStatusService,
    private readonly chatService: ChatService,
    private readonly chatFiltersService: ChatFiltersService
  ) {
    this.currentChats = this.chatService.chats

    effect(() => {
      const id = this.currentChatRoomId()
      const chats = this.currentChats()

      if (id && chats.length > 0) {
        this.updateChatRoomData()
      }
    })
  }

  public async deleteChatRoom (id: string, newChats: ChatI[]) {
    const prevChats =  this.currentChats()
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

  public updateChatRoom (id: string, data: Partial<UpdateChatRoomDto>, filter: ChatFiltersEnum = ChatFiltersEnum.ALL): Observable<any> {

    const prevChats =  this.currentChats()
    return this.chatRoomApiService.updateChatRoom(id, data).pipe(
      switchMap(() => this.chatService.getChats()),
      tap(() => {
        this.chatFiltersService.filterChats(filter)
      }),
      catchError(() =>  {
        this.chatService.chats.set(prevChats)
        return of([])
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
  }

  updateChatRoomData () {
    this.isLoading.set(true)
    const id = this.currentChatRoomId()
    const chats =  this.currentChats()
    const foundChat = chats.find(chat => chat.id === id)

    if (foundChat) {
      this.addColorToNamesInGroups(foundChat)
      this.currentChatRoomData.set(foundChat)
    }
    setTimeout(() => {
      this.isLoading.set(false)
    }, 0)
  }

  private addColorToNamesInGroups (foundChat: ChatI) {
    const colors = chatRoomGroupNameColors
    const map = new Map()
    foundChat?.users.forEach((user, index) => {
      map.set(user.id, colors[index])
    })
    this.nameColors.set(map)
  }

  handleUserIswriting () {
    this.socketStatusService.emit('writing-from-client', { isWriting: true, chatRoomId: this.currentChatRoomId() })

    if (this.writingTimeout) {
      clearTimeout(this.writingTimeout)
    }

    this.writingTimeout = setTimeout(() => {
      this.socketStatusService.emit('writing-from-client',  { isWriting: false, chatRoomId: this.currentChatRoomId() })
      this.writingTimeout = null
    }, 1000)
  }

  getChatRoomByContactUserId (contactId: string) {
    return this.chatRoomApiService.getChatRoomByContactUserId(contactId)
  }

  newGroupSocket () {
    this.socketStatusService.on('new-group-from-server', () => {
      this.chatService.getChats().subscribe()

    })
  }

  usersOnlineSocket () {
    this.socketStatusService.on('users-online-updated', (uids: string[]) => {
      this.chatService.getChats().subscribe()
      this.onlineUsersSubject.next(uids)
    })
  }

  usersWritingSocket () {
    this.socketStatusService.on('writing-from-server', (data: Array<{ userID: string, chatRoomId: string }>) => {
      this.writingUsersSubject.next(data)
    })
  }
}

