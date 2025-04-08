import { MessageApiService } from './../../../core/services/api/message-api.service';
import {
  ChatRoomCreateMessageI,
  ChatRoomMessageI,
} from './../interfaces/chat-room-messages.interface';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { ChatRoomApiService } from '../../../core/services/api';
import { ChatRoomI } from '../../chats/model';
import { UserService } from '../../user/services/user.service';
import { ChatService } from '../../chats/services/chat.service';
import { SocketStatusService } from '../../../core/services/socket/socket-status.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatsRoomService {
  currentChatRoomId = signal('');
  currentChatRoomData: WritableSignal<ChatRoomI | null> = signal(null);
  chatRoomMessages: WritableSignal<ChatRoomMessageI[]> = signal([]);
  onlineUsersSubject = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSubject.asObservable();

  constructor(
    private readonly chatRoomApiService: ChatRoomApiService,
    private readonly userService: UserService,
    private readonly messageApiService: MessageApiService,
    private readonly chatsService: ChatService,
    private readonly socketStatusService: SocketStatusService
  ) {}

  showChatRoomData(id: string) {
    if (id !== this.currentChatRoomId()) this.currentChatRoomData.set(null);
    this.chatRoomApiService.findOneChatRoom(id).subscribe({
      next: (data) => {
        this.currentChatRoomData.set(data);
        this.currentChatRoomId.set(data.id);

        const updatedMessages: ChatRoomMessageI[] = this.transformMessageData(
          data.messages
        );
        this.chatRoomMessages.set(updatedMessages);
      },
    });
  }

  private transformMessageData(messages: ChatRoomMessageI[]) {
    const userId = this.userService.loginUserData()?.id;
    return messages.map((message) => {
      return {
        ...message,
        type:
          userId === message.owner.id
            ? ('sent' as 'sent' | 'received')
            : ('received' as 'sent' | 'received'),
      };
    });
  }

  createMessage(text: string) {
    const message: ChatRoomCreateMessageI = {
      text,
      ownerId: this.userService.loginUserData()?.id ?? '',
      chatRoomId: this.currentChatRoomId(),
    };
    this.socketStatusService.emit('message-from-client', message);
  }

  newMessageSocket() {
    this.socketStatusService.on(
      'message-from-server',
      (message: ChatRoomCreateMessageI) => {
        const prevMessages = this.chatRoomMessages();

        this.messageApiService.createApiMessage(message).subscribe({
          next: (message) => {
            this.chatRoomMessages.update((prev) =>
              this.transformMessageData([...prev, message])
            );
            this.chatsService.getChatsRoom();
          },
          error: (error) => {
            console.log(error);
            this.chatRoomMessages.set(prevMessages);
          },
        });
      }
    );
  }

  usersLastSeenSocket() {
    this.socketStatusService.on('users-last-seen', () => {
      this.showChatRoomData(this.currentChatRoomId());
    });
  }

  usersOnlineSocket() {
    this.socketStatusService.on('users-online-updated', (uids: string[]) => {
      this.onlineUsersSubject.next(uids);
    });
  }

  // newMessageSocket() {
  //   this.socketStatusService.em('new-message', (uids: string[]) => {
  //     this.onlineUsersSubject.next(uids);
  //   });
  // }
}
