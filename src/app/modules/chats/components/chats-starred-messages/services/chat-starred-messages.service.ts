import { Injectable, signal } from '@angular/core'
import { ChatRoomMessageI } from '../../chats-room/interfaces'
import { ChatStarredMessagesViewI } from '../interfaces/chat-starred-messages.interface'
import { UtilsService } from '../../../../../core/services/utils.service'


@Injectable({ providedIn: 'root' })
export class ChatStarredMessagesService {

  chatStarredHeaderOptions = signal([
    { name: 'Nuevo grupo', id: 'newGroup' },
    { name: 'Mensajes destacados', id: 'featuredMessages' },
    { name: 'Seleccionar chats', id: 'selectChats' },
    { name: 'Cerrar sesión', id: 'logOut' }
  ])

  constructor (
    private readonly utilsService: UtilsService
  ) {

  }


  getStarredMessagesViewData (starredMessages: ChatRoomMessageI[]): ChatStarredMessagesViewI[] {
    console.log(starredMessages)
    const starredMessagesData: ChatStarredMessagesViewI[] = starredMessages.map(starredMessage => {
      const { chatRoom } = starredMessage
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      const dayName = days[new Date(starredMessage.date).getDay()]

      return {
        messageHour: starredMessage.messageHour,
        text: starredMessage.text,
        title: `${starredMessage.owner.firstName} ${starredMessage.owner.lastName}`,
        urlImg: chatRoom.urlImg,
        message: starredMessage,
        messageDate: dayName
      }
    })

    return starredMessagesData
  }



}
