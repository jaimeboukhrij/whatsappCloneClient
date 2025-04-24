import { Injectable, signal } from '@angular/core'
import { ChatRoomMessageI } from '../../../../../model/chat-room-messages.interface'

@Injectable({ providedIn: 'root' })
export class ChatsRoomMessageOptionsService {
  public currentMessagesOptionsId = signal<string | null>('null')
  public showChatRoomMessageOptions = signal(false)
  public messagesIdsSelectedToDelete = signal<string[]>([])
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




  oncClickOption (optionId: string, messageData: ChatRoomMessageI) {
    this.currentMessagesOptionsId.set(optionId)
    switch (optionId) {
      case 'remove':
        this.removeMessage(messageData)
        break

      default:
        break
    }
  }

  private removeMessage (messageData: ChatRoomMessageI) {
    this.messagesIdsSelectedToDelete.update(prev => ([...prev, messageData.id]))
  }


}