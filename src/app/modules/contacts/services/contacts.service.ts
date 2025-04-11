import { ChatsRoomService } from './../../chats/services/chats-room.service'
import { inject, Injectable, signal } from '@angular/core'
import { StorageService } from '../../../core/services/storage.service'
import {  ContactInterface } from '../model'
import { debounceTime, EMPTY, from, Subject, switchMap, tap } from 'rxjs'
import { ContactApiService } from '../../../core/services/api'
import {  IUser } from '../../../shared/interfaces/user.interface'
import { ChatApiService } from '../../../core/services/api/chat-api.service'
import { Router } from '@angular/router'
import { ChatService } from '../../chats/services/chat.service'

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private readonly storageService = inject(StorageService)
  private readonly contactApiService = inject(ContactApiService)
  private readonly chatApiService = inject(ChatApiService)
  private readonly router = inject(Router)
  private readonly chatsRoomService = inject(ChatsRoomService)
  private readonly chatService = inject(ChatService)

  private readonly searchQuery$ = new Subject<string>()
  private readonly firstLetterSet = new Set<string>()
  private readonly originalContactData = signal<IUser[]>([])
  public contactsData = signal<ContactInterface[]>([])
  public isChatInputLoading = signal(false)
  public userContacts = signal<IUser[]>([])

  constructor () {
    this.filterByQuery()
  }

  public getContactsData (): void {
    const storedData =
      this.storageService.getItem<ContactInterface[]>('contactsData')

    if (storedData && Date.now() - storedData.timestamp < 60 * 60 * 1000) {
      this.contactsData.set(storedData.data)
      this.originalContactData.set(
        this.getUserDataFromContact(storedData.data)
      )
      return
    }

    this.contactApiService.getApiContacts().subscribe((contacts) => {
      const transformedContactsData = this.transformContactsData(contacts)
      this.contactsData.set(transformedContactsData)
      this.storageService.setItem('contactsData', transformedContactsData)

      this.originalContactData.set(contacts)
    })
  }

  public async geUserContacts () {
    return await new Promise<IUser[]>((resolve) => {
      this.contactApiService.getApiContacts().subscribe((contacts) => {
        this.userContacts.set(contacts)
        resolve(contacts)
      })
    })
  }

  public onInputQueryChange (query: string) {
    this.isChatInputLoading.set(true)
    this.searchQuery$.next(query)
  }

  public createChatRoom (contactId: string, type: 'private' | 'group') {
    this.chatsRoomService.getChatRoomByContactUserId(contactId).pipe(
      switchMap((chatRoom) => {
        if (!chatRoom) {
          return this.chatService.createChat(contactId, type).pipe(
            switchMap(async (chat) =>
              await this.router.navigate(['/chats']).then(() => chat)
            ),
            switchMap((chat) =>
              this.chatService.getChats().pipe(
                tap(() => { this.chatsRoomService.changeChatRoomData(chat.id) })
              )
            )
          )
        } else {
          return from(this.router.navigate(['/chats'])).pipe(
            switchMap((chat) =>
              this.chatService.getChats().pipe(
                tap(() => { this.chatsRoomService.changeChatRoomData(chatRoom.id) })
              )
            ),
            switchMap(() => EMPTY)
          )
        }
      })
    ).subscribe()
  }



  private filterByQuery (): void {
    this.searchQuery$.pipe(debounceTime(200)).subscribe((query) => {
      this.isChatInputLoading.set(false)
      if (!query) {
        this.contactsData.set(
          this.transformContactsData(this.originalContactData())
        )
        return
      }
      this.filterContactsDataByQuery(query)
    })
  }

  private filterContactsDataByQuery (query: string) {
    const upperQuery = query.toUpperCase()
    const contactsFilterByQuery = this.originalContactData().filter(
      ({ firstName }) => firstName.toUpperCase().includes(upperQuery)
    )

    this.contactsData.set(this.transformContactsData(contactsFilterByQuery))
  }

  private transformContactsData (contacts: IUser[]) {
    this.getFirstLettersOfContactData(contacts)
    return this.getSortedContactDataByLetter(contacts)
  }

  private getFirstLettersOfContactData (contacts: IUser[]) {
    this.firstLetterSet.clear()
    contacts
      .sort((a, b) => a.firstName.localeCompare(b.firstName))
      .forEach((contact) => this.firstLetterSet.add(contact.firstName[0]))
  }

  private getSortedContactDataByLetter (contacts: IUser[]) {
    const sortedContactsDataByLetter: ContactInterface[] = []

    this.firstLetterSet.forEach((letter) => {
      const filterContacts = contacts.filter(
        (elem) => elem.firstName[0].toUpperCase() === letter.toUpperCase()
      )
      if (filterContacts.length > 0)
        sortedContactsDataByLetter.push({ letter, data: filterContacts })
    })

    return sortedContactsDataByLetter
  }

  private getUserDataFromContact (contacts: ContactInterface[]): IUser[] {
    const contactData: IUser[] = []
    contacts.forEach((contact) => contactData.push(...contact.data))
    return contactData
  }
}
