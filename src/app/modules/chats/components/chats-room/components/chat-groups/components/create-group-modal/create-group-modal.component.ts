/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject,  OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { CreateGroupService } from '../../services/create-group.service'

@Component({
  selector: 'groups-create-group-modal',
  standalone: false,

  templateUrl: './create-group-modal.component.html',
  styleUrls: ['./create-group-modal.component.css']
})
export class CreateGroupModalComponent implements OnInit {
  private readonly createGroupService = inject(CreateGroupService)

  public groupMembers = this.createGroupService.groupMembers
  public isDataInputLoading = this.createGroupService.isDataInputLoading
  public createGroupForm = this.createGroupService.createGroupForm
  public userContacts = this.createGroupService.userContacts
  public isDataLoading = this.createGroupService.isDataLoading
  public previewImg = this.createGroupService.previewImg
  public groupName = this.createGroupService.groupName



  constructor (private readonly fb: FormBuilder) {

  }

  ngOnInit (): void {
    this.createGroupService.getUserContactsData()
  }

  onInputChange (event: Event) {
    this.createGroupService.onInputChange(event)
  }

  onInputMembersChange (q: string) {
    this.createGroupService.onInputMembersChange(q)
  }

  onEmojiChange (emoji: string) {
    this.createGroupService.onEmojiChange(emoji)
  }

  onFileSelected (event: Event) {
    this.createGroupService.onFileSelected(event)
  }

  isChecked (userId: string): boolean {
    return this.createGroupService.isChecked(userId)
  }

  canContinue () {
    return this.createGroupService.canContinue()
  }

  onCheckboxChange (event: any) {
    this.createGroupService.onCheckboxChange(event)
  }

  onClearGropuMembers () {
    this.createGroupService.onClearGropuMembers()
  }

  onClickOutSide (event: MouseEvent) {
    event.stopPropagation()
    this.createGroupService.showCreateGroupView.set(false)
  }

  onClickInside (event: MouseEvent) {
    event.stopPropagation()
  }

  onSubmit () {
    this.createGroupService.onSubmit()
  }
}
