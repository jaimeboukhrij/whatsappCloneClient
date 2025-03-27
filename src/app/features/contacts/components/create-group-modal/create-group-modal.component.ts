/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit, signal } from '@angular/core';
import { CreateGroupService } from '../../services';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'contacts-create-group-modal',
  standalone: false,

  templateUrl: './create-group-modal.component.html',
  styleUrls: ['./create-group-modal.component.css'],
})
export class CreateGroupModalComponent implements OnInit {
  private readonly createGroupService = inject(CreateGroupService);

  public userContacts = this.createGroupService.userContacts;
  public createGroupForm: FormGroup;
  public groupMembers = signal(0);
  public groupName = signal('hola');

  constructor(private fb: FormBuilder) {
    this.createGroupForm = this.fb.group({
      selections: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.createGroupService.geUserContacts();
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.groupName.set(target.value);
  }

  onEmojiChange(emoji: string) {
    this.groupName.update((prev) => prev + emoji);
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

  onClickOutSide(event: MouseEvent) {
    event.stopPropagation();
  }
  onClickInside(event: MouseEvent) {
    event.stopPropagation();
  }
}
