import { inject, Injectable, signal } from '@angular/core'
import { StorageService } from '../../../core/services/storage.service'
import { debounceTime, EMPTY, from, Subject, switchMap, tap, map } from 'rxjs'
import { ContactApiService } from '../../../core/services/api'
import { Router } from '@angular/router'
import { ChatService } from '../../chats/services/chats.service'
import { ChatsRoomService } from '../../chats/components/chats-room/services/chats-room.service'
import { CreateChatRoomDto } from '../../chats/components/chats-room/interfaces'
import { ContactI, ContactsViewI } from '../interfaces'

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private readonly storageService = inject(StorageService)
  private readonly contactApiService = inject(ContactApiService)
  private readonly router = inject(Router)
  private readonly chatsRoomService = inject(ChatsRoomService)
  private readonly chatService = inject(ChatService)

  private readonly searchQuery$ = new Subject<string>()
  private readonly firstLetterSet = new Set<string>()
  private readonly originalContactData = signal<ContactI[]>([])
  public contactsViewData = signal<ContactsViewI[]>([])
  public isChatInputLoading = signal(false)
  public userContacts = signal<ContactI[]>([])

  constructor () {
    this.filterByQuery()
  }

  public getContactsData (): void {
    const storedData =
      this.storageService.getItem<ContactsViewI[]>('contactsData')

    if (storedData && Date.now() - storedData.timestamp < 60 * 60 * 1000) {
      this.contactsViewData.set(storedData.data)
      this.originalContactData.set(
        this.getUserDataFromContact(storedData.data)
      )
      return
    }

    this.contactApiService.getApiContacts().subscribe((contacts) => {
      const transformedContactsData = this.transformContactsData(contacts)
      this.contactsViewData.set(transformedContactsData)
      this.storageService.setItem('contactsData', transformedContactsData)

      this.originalContactData.set(contacts)
    })
  }

  public async geUserContacts () {
    return await new Promise<ContactI[]>((resolve) => {
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

  public createChatRoom (memberId: string) {
    const data = {
      membersIds: [memberId],
      type: 'private'
    } as CreateChatRoomDto

    this.chatsRoomService.getChatRoomByContactUserId(memberId).pipe(
      switchMap((chatRoom) => {
        console.log('chatromm', chatRoom)
        if (chatRoom) {
          return from(this.router.navigate(['/chats'])).pipe(
            tap(() => this.chatsRoomService.changeChatRoomData(chatRoom.id)),
            switchMap(() => this.chatService.getChats()),
            // Omitimos el resultado final si no necesitas nada más
            switchMap(() => EMPTY)
          )
        }

        // Si no existe, lo creamos
        return this.chatsRoomService.createChatRoom(data).pipe(
          switchMap((chat) =>
            from(this.router.navigate(['/chats'])).pipe(
              map(() => chat) // Pasamos el chat al siguiente operador
            )
          ),
          tap((chat) => this.chatsRoomService.changeChatRoomData(chat.id)),
          switchMap(() => this.chatService.getChats())
        )
      })
    ).subscribe()
  }



  private filterByQuery (): void {
    this.searchQuery$.pipe(debounceTime(200)).subscribe((query) => {
      this.isChatInputLoading.set(false)
      if (!query) {
        this.contactsViewData.set(
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

    this.contactsViewData.set(this.transformContactsData(contactsFilterByQuery))
  }

  private transformContactsData (contacts: ContactI[]) {
    this.getFirstLettersOfContactData(contacts)
    return this.getSortedContactDataByLetter(contacts)
  }

  private getFirstLettersOfContactData (contacts: ContactI[]) {
    this.firstLetterSet.clear()
    contacts
      .sort((a, b) => a.firstName.localeCompare(b.firstName))
      .forEach((contact) => this.firstLetterSet.add(contact.firstName[0]))
  }

  private getSortedContactDataByLetter (contacts: ContactI[]) {
    const sortedContactsDataByLetter: ContactsViewI[] = []

    this.firstLetterSet.forEach((letter) => {
      const filterContacts = contacts.filter(
        (elem) => elem.firstName[0].toUpperCase() === letter.toUpperCase()
      )
      if (filterContacts.length > 0)
        sortedContactsDataByLetter.push({ letter, data: filterContacts })
    })

    return sortedContactsDataByLetter
  }

  private getUserDataFromContact (contacts: ContactsViewI[]): ContactI[] {
    const contactData: ContactI[] = []
    contacts.forEach((contact) => contactData.push(...contact.data))
    return contactData
  }
}
