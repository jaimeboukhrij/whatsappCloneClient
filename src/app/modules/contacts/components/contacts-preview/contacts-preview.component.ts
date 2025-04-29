import { Component, inject, Input } from '@angular/core'
import { ContactsService } from '../../services'
import { ContactI } from '../../interfaces'

@Component({
  selector: 'contacts-preview',
  templateUrl: './contacts-preview.component.html',
  standalone: false
})
export class ContactsPreviewComponent {
  private readonly contactsService = inject(ContactsService)

  @Input() public contactsData: ContactI = {} as ContactI
  @Input() public title: string | undefined = undefined

  onClickContact () {
    this.contactsService.createChatRoom(this.contactsData.id)
  }
}
