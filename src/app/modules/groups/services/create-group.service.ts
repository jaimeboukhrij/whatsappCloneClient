import { Injectable, signal,  WritableSignal } from '@angular/core'
import {  GroupApiService } from '../../../core/services/api'
import {  Router } from '@angular/router'
import { debounceTime, Subject } from 'rxjs'
import {  ContactsService } from '../../contacts/services'
import {  IUser } from '../../../shared/interfaces/user.interface'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'

@Injectable({ providedIn: 'root' })
export class CreateGroupService {
  public showCreateGroupView = signal(false)
  public isDataLoading = signal(false)
  public isDataInputLoading = signal(false)
  public query = signal('')
  public userContacts: WritableSignal<IUser[]> = signal([])
  public originalUserContacts: WritableSignal<IUser[]> = signal([])
  public searchQuery$ = new Subject<string>()
  public selectedFile = signal< File | undefined>(undefined)
  public createGroupForm: FormGroup
  public previewImg = signal('assets/images/add_image2.png')
  public groupMembers = signal(0)
  public groupName = signal('')




  constructor (
    private readonly groupsApiService: GroupApiService,
    private readonly router: Router,
    private readonly contactService: ContactsService,
    private readonly fb: FormBuilder
  ) {
    this.searchQuery$.pipe(debounceTime(300)).subscribe((query) => {
      if (!query) {
        this.userContacts.set(this.originalUserContacts())
        this.isDataInputLoading.set(false)

        return
      }
      this.getContactsByQuery(query)
    })

    this.createGroupForm = this.fb.group({
      selections: this.fb.array([])
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

  onFileSelected (event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files?.[0]) {
      this.selectedFile.set(input.files[0])

      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewImg.set(e.target?.result as string)
      }
      reader.readAsDataURL(input.files[0])
    }
  }

  onInputChange (event: Event) {
    const target = event.target as HTMLInputElement
    this.groupName.set(target.value)
  }

  canContinue () {
    return this.groupMembers.length && this.groupName
  }

  onCheckboxChange (event: any) {
    const selections = this.createGroupForm.get('selections') as FormArray

    if (event.target.checked) {
      selections.push(new FormControl(event.target.value))
    } else {
      const index = selections.controls.findIndex(
        (control) => control.value === event.target.value
      )
      selections.removeAt(index)
    }

    this.groupMembers.set(selections.length)
  }

  onClearGropuMembers () {
    const selections = this.createGroupForm.get('selections') as FormArray
    selections.clear()
    this.groupMembers.set(0)
  }


  isChecked (userId: string): boolean {
    const selections = this.createGroupForm.get('selections') as FormArray
    return selections.controls.some((control) => control.value === userId)
  }

  onEmojiChange (emoji: string) {
    this.groupName.update((prev) => prev + emoji + ' ')
  }

  onSubmit () {
    const membersFormArray = this.createGroupForm.get(
      'selections'
    ) as FormArray

    const members = membersFormArray.value.map((member: string) => member)

    const formData = new FormData()
    formData.append('members', JSON.stringify(members))
    formData.append('name', this.groupName())

    if (this.selectedFile()) {
      formData.append('image', this.selectedFile()!)
    }
    this.createGroup(formData)
  }
}
