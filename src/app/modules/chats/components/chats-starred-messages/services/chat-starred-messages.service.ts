import { Injectable, signal } from '@angular/core'
import { MessagesDataI } from '../../../model'


@Injectable({ providedIn: 'root' })
export class ChatStarredMessagesService {

  chatStarredHeaderOptions = signal([
    { name: 'Nuevo grupo', id: 'newGroup' },
    { name: 'Mensajes destacados', id: 'featuredMessages' },
    { name: 'Seleccionar chats', id: 'selectChats' },
    { name: 'Cerrar sesión', id: 'logOut' }
  ])


  updateStarredMessagesData (starredMessages: MessagesDataI[]) {

    // const starredMessagesData = starredMessages.map(starredMessage => {
    //   const {} = starredMessage
    // })
  }



}