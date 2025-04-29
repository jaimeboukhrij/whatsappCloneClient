import { Injectable, signal } from '@angular/core'
import { ChatRoomMessageI } from '../../chats-room/interfaces'


@Injectable({ providedIn: 'root' })
export class ChatStarredMessagesService {

  chatStarredHeaderOptions = signal([
    { name: 'Nuevo grupo', id: 'newGroup' },
    { name: 'Mensajes destacados', id: 'featuredMessages' },
    { name: 'Seleccionar chats', id: 'selectChats' },
    { name: 'Cerrar sesión', id: 'logOut' }
  ])


  updateStarredMessagesData (starredMessages: ChatRoomMessageI[]) {

    // const starredMessagesData = starredMessages.map(starredMessage => {
    //   const {} = starredMessage
    // })
  }



}
