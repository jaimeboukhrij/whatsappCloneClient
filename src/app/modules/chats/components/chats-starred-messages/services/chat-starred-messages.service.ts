import { Injectable, signal } from '@angular/core'
import { ChatRoomMessageI } from '../../chats-room/interfaces'
import { ChatStarredMessagesViewI } from '../interfaces/chat-starred-messages.interface'
import { UtilsService } from '../../../../../core/services/utils.service'
import { UserService } from '../../../../user/services/user.service'


@Injectable({ providedIn: 'root' })
export class ChatStarredMessagesService {

  chatStarredHeaderOptions = signal([
    { name: 'Nuevo grupo', id: 'newGroup' },
    { name: 'Mensajes destacados', id: 'featuredMessages' },
    { name: 'Seleccionar chats', id: 'selectChats' },
    { name: 'Cerrar sesión', id: 'logOut' }
  ])

  starredMessagesViewData = signal<ChatStarredMessagesViewI[]>([])
  constructor (
    private readonly utilsService: UtilsService,
    private readonly userService: UserService

  ) {

  }

  getUserStarredMessages () {
    this.userService.getUserStarredMessages()
      .subscribe({
        next: (starredMessages) => {
          const starredMessagesViewData = this.getStarredMessagesViewData(starredMessages)
          this.starredMessagesViewData.set(starredMessagesViewData)
        }
      })
  }


  private getStarredMessagesViewData (starredMessages: ChatRoomMessageI[]): ChatStarredMessagesViewI[] {
    const now = new Date()

    const starredMessagesData: ChatStarredMessagesViewI[] = starredMessages.map(starredMessage => {
      const { chatRoom } = starredMessage
      const messageDate = new Date(starredMessage.date)

      const diffInMs = now.getTime() - messageDate.getTime()
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

      let messageDateDisplay: string

      if (diffInDays > 7) {
        // Si tiene más de una semana, mostramos en formato DD/MM/YYYY
        const day = messageDate.getDate().toString().padStart(2, '0')
        const month = (messageDate.getMonth() + 1).toString().padStart(2, '0') // +1 porque los meses van de 0 a 11
        const year = messageDate.getFullYear()
        messageDateDisplay = `${day}/${month}/${year}`
      } else {
        // Si tiene menos de una semana, mostramos el nombre del día
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        messageDateDisplay = days[messageDate.getDay()]
      }

      return {
        messageHour: starredMessage.messageHour,
        text: starredMessage.text,
        title: `${starredMessage.owner.firstName} ${starredMessage.owner.lastName}`,
        urlImg: chatRoom.urlImg,
        message: starredMessage,
        messageDate: messageDateDisplay
      }
    })

    return starredMessagesData
  }




}
