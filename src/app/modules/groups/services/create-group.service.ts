import { Injectable, signal, type WritableSignal } from '@angular/core'
import { type GroupApiService } from '../../../core/services/api'
import { type Router } from '@angular/router'
import { debounceTime, Subject } from 'rxjs'
import { type ContactsService } from '../../contacts/services'
import { type IUser } from '../../../shared/interfaces/user.interface'

@Injectable({ providedIn: 'root' })
export class CreateGroupService {
  public showCreateGroupView = signal(false)
  public isDataLoading = signal(false)
  public isDataInputLoading = signal(false)
  public query = signal('')
  public userContacts: WritableSignal<IUser[]> = signal([])
  public originalUserContacts: WritableSignal<IUser[]> = signal([])
  public searchQuery$ = new Subject<string>()

  constructor (
    private readonly groupsApiService: GroupApiService,
    private readonly router: Router,
    private readonly contactService: ContactsService
  ) {
    this.searchQuery$.pipe(debounceTime(300)).subscribe((query) => {
      if (!query) {
        this.userContacts.set(this.originalUserContacts())
        this.isDataInputLoading.set(false)

        return
      }
      this.getContactsByQuery(query)
    })
  }

  onInputMembersChange (q: string) {
    this.isDataInputLoading.set(true)

    this.searchQuery$.next(q)
  }

  async getUserContactsData () {
    await this.contactService.geUserContacts()
    this.userContacts.set(this.contactService.userContacts())
    this.originalUserContacts.set(this.contactService.userContacts())
  }

  getContactsByQuery (q: string) {
    const originalContact = this.originalUserContacts()
    const filtercontact = originalContact.filter((elem) =>
      elem.firstName.toLowerCase().includes(q.toLowerCase())
    )
    this.userContacts.set(filtercontact)
    this.isDataInputLoading.set(false)
  }

  createGroup (data: FormData) {
    this.isDataLoading.set(true)
    this.groupsApiService.createGroup(data).subscribe({
      next: () => {
        this.router.navigate(['/chats'])
      },
      error: (err) => {
        this.router.navigate(['/groups'])
        console.error('Error creating group:', err)
      },
      complete: () => {
        this.isDataLoading.set(false)
        this.showCreateGroupView.set(false)
      }
    })
  }
}
