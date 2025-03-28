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
  public groupName = signal('');
  public selectedFile: File | null = null;
  public previewImg = 'assets/images/add_image2.png';

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
    selections.clear(); // Elimina todos los controles en el FormArray
    this.groupMembers.set(0); // Resetea el contador de miembros del grupo a 0
  }

  onClickOutSide(event: MouseEvent) {
    event.stopPropagation();
  }
  onClickInside(event: MouseEvent) {
    event.stopPropagation();
  }
}
