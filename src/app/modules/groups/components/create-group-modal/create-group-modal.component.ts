/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CreateGroupService } from '../../services/create-group.service';
import { ContactsService } from '../../../contacts/services';

@Component({
  selector: 'groups-create-group-modal',
  standalone: false,

  templateUrl: './create-group-modal.component.html',
  styleUrls: ['./create-group-modal.component.css'],
})
export class CreateGroupModalComponent implements OnInit {
  private readonly createGroupService = inject(CreateGroupService);
  private readonly contactsService = inject(ContactsService);

  public userContacts = this.createGroupService.userContacts;
  public createGroupForm: FormGroup;
  public groupMembers = signal(0);
  public groupName = signal('');
  public selectedFile: File | undefined = undefined;
  public previewImg = 'assets/images/add_image2.png';
  public isDataLoading = this.createGroupService.isDataLoading;
  public isDataInputLoading = this.createGroupService.isDataInputLoading;

  constructor(private fb: FormBuilder) {
    this.createGroupForm = this.fb.group({
      selections: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    this.createGroupService.getUserContactsData();
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.groupName.set(target.value);
  }

  onInputMembersChange(q: string) {
    this.createGroupService.onInputMembersChange(q);
  }

  onEmojiChange(emoji: string) {
    this.groupName.update((prev) => prev + emoji + ' ');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImg = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  isChecked(userId: string): boolean {
    const selections = this.createGroupForm.get('selections') as FormArray;
    return selections.controls.some((control) => control.value === userId);
  }

  canContinue() {
    return this.groupMembers.length && this.groupName;
  }

  onCheckboxChange(event: any) {
    const selections = this.createGroupForm.get('selections') as FormArray;

    if (event.target.checked) {
      selections.push(new FormControl(event.target.value));
    } else {
      const index = selections.controls.findIndex(
        (control) => control.value === event.target.value
      );
      selections.removeAt(index);
    }

    this.groupMembers.set(selections.length);
  }

  onClearGropuMembers() {
    const selections = this.createGroupForm.get('selections') as FormArray;
    selections.clear();
    this.groupMembers.set(0);
  }

  onClickOutSide(event: MouseEvent) {
    event.stopPropagation();
    this.createGroupService.showCreateGroupView.set(false);
  }
  onClickInside(event: MouseEvent) {
    event.stopPropagation();
  }

  onSubmit() {
    const membersFormArray = this.createGroupForm.get(
      'selections'
    ) as FormArray;

    const members = membersFormArray.value.map((member: string) => member);

    const formData = new FormData();
    formData.append('members', JSON.stringify(members));
    formData.append('name', this.groupName());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    this.createGroupService.createGroup(formData);
  }
}
