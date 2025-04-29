import { Injectable, signal } from '@angular/core'
import { CreateGroupService } from '../../chats-room/components/chat-groups/services/create-group.service'
import { AuthService } from '../../../../auth/services/auth.service'
import { ChatService } from '../../../services/chats.service'

@Injectable({ providedIn: 'root' })
export class ChatHeaderService {

  chatHeaderOptions = signal([
    { name: 'Nuevo grupo', id: 'newGroup' },
    { name: 'Mensajes destacados', id: 'starredMessages' },
    { name: 'Seleccionar chats', id: 'selectChats' },
    { name: 'Cerrar sesión', id: 'logOut' }
  ])

  public showCreateGroupView
  showStarredMessages

  constructor (
    private readonly createGroupService: CreateGroupService,
    private readonly authService: AuthService,
    private readonly chatService: ChatService
  ) {
    this.showCreateGroupView = this.createGroupService.showCreateGroupView
    this.showStarredMessages = this.chatService.showStarredMessages
  }


  onOptionClick (optionId: string) {


    switch (optionId) {
      case 'newGroup':
        this.onNewGroupClick()
        break
      case 'starredMessages':
        this.onStarredMessagesClick()
        break
      case 'logOut':
        this.onLogOutClick()
        break


      default:
        break
    }


  }


  private onNewGroupClick () {
    this.createGroupService.showCreateGroupView.set(true)
  }

  private onStarredMessagesClick () {
    this.showStarredMessages.set(true)
  }

  private onLogOutClick () {
    this.authService.logOut()
  }

}