import { ChatRoomMessagesService } from './../../services/chats-room-messages.service'
import { Component, inject, OnInit, signal } from '@angular/core'
import { CreateGroupService } from '../../../chat-groups/services/create-group.service'
import { ChatService } from '../../../../../../services/chats.service'
import { IUser } from '../../../../../../../../shared/interfaces/user.interface'
import { UserService } from '../../../../../../../user/services/user.service'
import { FormArray, FormBuilder, FormControl } from '@angular/forms'
import { ContactsService } from '../../../../../../../contacts/services'
import { debounceTime, map, Subject } from 'rxjs'
import { ChatsRoomService } from '../../../../services/chats-room.service'
import { ForwardUsersDataPreviewI } from './interface/chat-room-forward.interface'


@Component({
  selector: 'app-chat-room-forward-modal',
  standalone: false,
  templateUrl: './chat-room-forward-modal.component.html',
  styleUrl: './chat-room-forward-modal.component.css'
})
export class ChatRoomForwardModalComponent implements OnInit {
  private readonly createGroupService = inject(CreateGroupService)
  private readonly fb = inject(FormBuilder)
  private readonly chatService = inject(ChatService)
  private readonly userService = inject(UserService)
  private readonly contactsService = inject(ContactsService)
  private readonly chatRoomMessagesService = inject(ChatRoomMessagesService)
  private readonly chatRoomService = inject(ChatsRoomService)


  groupMembersNames = signal([])
  chatsSelectedForm = this.fb.group({ selections: this.fb.array([]) })
  public groupMembers = signal(0)
  showForwdardButton = signal(false)


  public isDataInputLoading = this.createGroupService.isDataInputLoading
  public userContacts = this.createGroupService.userContacts
  // public isDataLoading = this.createGroupService.isDataLoading
  // public previewImg = this.createGroupService.previewImg
  // public groupName = this.createGroupService.groupName

  public contactsDataPreview = signal<ForwardUsersDataPreviewI[] >([])
  public chatsDataPreview = signal<ForwardUsersDataPreviewI[] >([])
  private  originalContactsDataPreview: ForwardUsersDataPreviewI[] = []
  private  originalChatsDataPreview: ForwardUsersDataPreviewI[] = []

  private readonly searchQueryInput$ = new Subject<string>()





  ngOnInit (): void {
    this.getDataPreview()
    this.searchQueryInput$
      .pipe(
        debounceTime(100),
        map((query: string) => {
          const updatedChatsData = this.originalChatsDataPreview.filter(data => data.name.toLowerCase().includes(query.toLowerCase()))
          this.chatsDataPreview.set(updatedChatsData)

          const updatedContactsData = this.originalContactsDataPreview.filter(data => data.name.toLowerCase().includes(query.toLowerCase()))
          this.contactsDataPreview.set(updatedContactsData)
        })
      )
      .subscribe(()=>{
        this.isDataInputLoading.set(false)
      })
  }

  private async getDataPreview () {
    const currentChats: ForwardUsersDataPreviewI[] = this.chatService.chats().map(chat => ({
      id: chat.id,
      name: chat.name,
      status: chat.status,
      urlImg: chat.urlImg,
      type: 'chat' as 'chat' | 'contact',
      chatRoomId: chat.id

    }))
    this.chatsDataPreview.set(currentChats)
    this.originalChatsDataPreview = currentChats

    const currentContacts = (await this.contactsService.geUserContacts())
      .map(contact => ({
        id: contact.id,
        name: contact.firstName + contact.lastName,
        status: contact.status,
        urlImg: contact.urlImg,
        type: 'contact' as 'chat' | 'contact'
      }))
      .filter(contact => currentChats.every(chat => chat.urlImg !== contact.urlImg))

    this.contactsDataPreview.set(currentContacts)
    this.originalContactsDataPreview = currentContacts

  }

  getGroupMembersName (users: IUser[]) {
    const currentUserId = this.userService.loginUserData()?.id
    if (!currentUserId)  return
    if (users.length === 1) return 'Tú'
    return users
      .filter(user => user.id !== currentUserId)
      .map(user => ' ' + user.firstName )
      .toString() + ' ,Tú'
  }

  onInputChange (q: string) {
    this.isDataInputLoading.set(true)
    this.searchQueryInput$.next(q)

  }


  onEmojiChange (emoji: string) {
  }

  onFileSelected (event: Event) {
  }

  isChecked (userId: string): boolean {
    const selections = this.chatsSelectedForm.get('selections') as FormArray
    return selections.controls.some((control) => control.value.id === userId)
  }

  canContinue () {
  }

  onCheckboxChange (data: ForwardUsersDataPreviewI, type: 'chat' | 'contact') {
    const selections = this.chatsSelectedForm.get('selections') as FormArray
    const index = selections.controls.findIndex(control => control.value.id === data.id)

    if (index !== -1) {
      selections.removeAt(index)
    } else {

      selections.push(new FormControl({ ...data, type, chatRoomId: data.chatRoomId }))
      this.groupMembers.set(selections.length)
    }

    const updatedSelection = this.chatsSelectedForm.get('selections') as FormArray
    this.showForwdardButton.set(updatedSelection.length > 0)
  }


  onClearGropuMembers () {
  }

  onClickOutSide (event: MouseEvent) {
    event.stopPropagation()
  }

  onClickInside (event: MouseEvent) {
    event.stopPropagation()
  }

  onXClick () {
    this.chatRoomService.showForwardModal.set(false)
  }

  getSelectedNamesChats () {
    const selections = this.chatsSelectedForm.get('selections') as FormArray

    const selectedNamesChats =  selections.controls.map(({ value: data }, index) => {
      if (index === 0) return data?.name
      return ' ' + data?.name
    })

    if (selectedNamesChats.length >= 3 ) {
      return selectedNamesChats.slice(0, 3).toString() + '...'
    }

    return selectedNamesChats


  }

  onSubmit () {
    const chatsSelectedFormArray = this.chatsSelectedForm.get('selections') as FormArray
    const chatsSelected: ForwardUsersDataPreviewI[] = chatsSelectedFormArray.value
    this.chatRoomMessagesService.onSubmitForwardMessage(chatsSelected )
    this.chatRoomMessagesService.messagesDataSelected.set([])
    this.chatRoomMessagesService.currentMessagesOptionsId.set(null)
    this.chatRoomMessagesService.showCheckBox.set(false)
  }
}
