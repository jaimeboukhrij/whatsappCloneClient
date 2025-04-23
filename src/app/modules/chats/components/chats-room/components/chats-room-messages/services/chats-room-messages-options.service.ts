import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class ChatsRoomMessageOptionsService {
  public showChatRoomMessageOptions = signal(false)
  public messagesOptions = [
    {
      id: 'respond',
      name: 'Responder'
    },
    {
      id: 'copy',
      name: 'Copiar'
    },
    {
      id: 'react',
      name: 'Reaccionar'
    },
    {
      id: 'forward',
      name: 'Reenviar'
    },
    {
      id: 'pinUp',
      name: 'Fijar'
    },
    {
      id: 'standOut',
      name: 'Destacar'
    },
    {
      id: 'remove',
      name: 'Eliminar'
    }
  ]

}