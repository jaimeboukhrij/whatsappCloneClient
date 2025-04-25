import { Injectable, signal } from '@angular/core'
import { CreateGroupService } from '../../chats-room/components/chat-groups/services/create-group.service'
import { AuthService } from '../../../../auth/services/auth.service'

@Injectable({ providedIn: 'root' })
export class ChatHeaderService {

  chatHeaderOptions = signal([
    { name: 'Nuevo grupo', id: 'newGroup' },
    { name: 'Mensajes destacados', id: 'featuredMessages' },
    { name: 'Seleccionar chats', id: 'selectChats' },
    { name: 'Cerrar sesión', id: 'logOut' }
  ])

  public showCreateGroupView

  constructor (
    private readonly createGroupService: CreateGroupService,
    private readonly authService: AuthService
  ) {
    this.showCreateGroupView = this.createGroupService.showCreateGroupView
  }


  onOptionClick (optionId: string) {


    switch (optionId) {
      case 'newGroup':
        this.onNewGroupClick()
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

  private onLogOutClick () {
    this.authService.logOut()
  }

}