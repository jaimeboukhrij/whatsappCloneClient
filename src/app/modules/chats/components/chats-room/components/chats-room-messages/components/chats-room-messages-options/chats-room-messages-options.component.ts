import { OriginStartEnum } from '../../../../../../../../shared/components/chat-preview-options/interfaces/options-section.interface'
import { Component, HostListener, inject, Input, OnInit, signal, WritableSignal } from '@angular/core'
import { ChatRoomMessageI } from '../../../../interfaces/chat-room-messages.interface'
import { UtilsService } from '../../../../../../../../core/services/utils.service'
import { ChatRoomMessagesService } from '../../services'
import { UserService } from '../../../../../../../user/services/user.service'

@Component({
  selector: 'chats-room-messages-options',
  standalone: false,
  templateUrl: './chats-room-messages-options.component.html',
  styleUrl: './chats-room-messages-options.component.css'
})
export class ChatsRoomMessagesOptionsComponent implements OnInit {
  private readonly utilsService = inject(UtilsService)
  private readonly chatRoomMessagesService = inject(ChatRoomMessagesService)
  private readonly userService = inject(UserService)


  public rgbColor = signal('0, 92, 75')
  public optionsSectionCordenates = signal({ x: 0, y: 0 })
  public startAnimation = signal<OriginStartEnum>(OriginStartEnum.bottom_left)
  public messageClickedIdToShowOptiones = this.chatRoomMessagesService.messageClickedIdToShowOptiones

  public messagesOptions: Array<{ id: string, name: string }> = []

  _messageData: ChatRoomMessageI | null = null

  @Input()showChatRoomMessageButtonOptions!: WritableSignal<boolean>

  @Input() set messageData (messageData: ChatRoomMessageI) {
    this._messageData = messageData
    const currentUserId = this.userService.loginUserData()?.id

    this.messagesOptions =  [
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
        name: messageData.starredBy?.some(user =>user.id === currentUserId) ? 'No Destacar' : 'Destacar'
      },
      {
        id: 'remove',
        name: 'Eliminar'
      }
    ]

  }

  ngOnInit () {
    if (this._messageData?.type === 'received') { this.rgbColor.set('32, 44, 51'); return }
    this.rgbColor.set('0, 92, 75')
  }



  private getOptionsPosition (event: Event) {
    const OPTIONS_HEIGHT = 330
    const BELOW_OFFSET_Y = -290
    const DEFAULT_Y = 23

    const isBelow = this.utilsService.checkIfElementIsBelow(event as MouseEvent, OPTIONS_HEIGHT)
    const isElementOutOfViewport = this.utilsService.isElementOutOfViewport(event as MouseEvent, 156)

    this.setAnimationStart(isBelow, isElementOutOfViewport)

    const baseCoordinates = this.messageData?.type === 'sent'
      ? { x: 9, y: DEFAULT_Y }
      : { x: -141, y: DEFAULT_Y }

    return {
      x: isElementOutOfViewport ? baseCoordinates.x + 150 : baseCoordinates.x,
      y: isBelow ? BELOW_OFFSET_Y : baseCoordinates.y
    }
  }

  private setAnimationStart (isBelow: boolean, isElementOutOfViewport: boolean) {
    const isSent = this._messageData?.type === 'sent'

    let direction: OriginStartEnum

    if (isElementOutOfViewport) {
      direction = isBelow ? OriginStartEnum.bottom_right : OriginStartEnum.top_right
    } else {
      direction = isSent
        ? (isBelow ? OriginStartEnum.bottom_right : OriginStartEnum.top_right)
        : (isBelow ? OriginStartEnum.bottom_left : OriginStartEnum.top_left)
    }

    this.startAnimation.set(direction)
  }

  onClickOptionsButton (event: Event) {
    event.stopPropagation()
    const currentMessageId = this._messageData!.id
    const currentSelectedMessageId =  this.messageClickedIdToShowOptiones()

    if (currentMessageId === currentSelectedMessageId) {
      this.messageClickedIdToShowOptiones.set(null)
      return
    }
    this.optionsSectionCordenates.set(this.getOptionsPosition(event))
    this.messageClickedIdToShowOptiones.set(currentMessageId)

  }

  onClickOption (data: { id: string, event: MouseEvent }) {
    event?.stopPropagation()
    this.showChatRoomMessageButtonOptions.set(false)
    this.messageClickedIdToShowOptiones.set(null)
    this.chatRoomMessagesService.onClickOption(data.id, this._messageData!)
  }

  @HostListener('document:click', ['$event'])
  onClickOutside (event: Event) {
    if (!this.messageClickedIdToShowOptiones()) return
    const target = event.target as HTMLElement

    if (!target.closest('.chat-options') ) {
      this.messageClickedIdToShowOptiones.set(null)
      this.showChatRoomMessageButtonOptions.set(false)


    }
  }

}
