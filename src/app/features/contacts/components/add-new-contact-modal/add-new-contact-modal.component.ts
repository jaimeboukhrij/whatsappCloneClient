import { AddNewcontactService } from './../../services/add-new-contact.service';
import { Component, OnInit, WritableSignal } from '@angular/core';
import { IUser } from '../../../../shared/interfaces/user.interface';

@Component({
  selector: 'contacts-add-new-contact-modal',
  standalone: false,

  templateUrl: './add-new-contact-modal.component.html',
  styles: ``,
})
export class AddNewContactModalComponent implements OnInit {
  public usersRecommended: WritableSignal<IUser[]>;
  public userFindByQuery: WritableSignal<IUser[]>;
  public isDataLoading: WritableSignal<boolean>;
  public query: WritableSignal<string>;
  constructor(private readonly addNewcontactService: AddNewcontactService) {
    this.usersRecommended = this.addNewcontactService.usersRecommended;
    this.userFindByQuery = this.addNewcontactService.userFindByQuery;
    this.isDataLoading = this.addNewcontactService.isDataLoading;
    this.query = this.addNewcontactService.query;
  }
  ngOnInit(): void {
    this.addNewcontactService.getUsersRecommended();
    this.query.set('');
  }
  onChangeQueryInput(query: string) {
    this.addNewcontactService.onChangeQueryInput(query);
  }
  onClickOutSide(event: MouseEvent) {
    event.stopPropagation();
    this.addNewcontactService.showNewContactModal.set(false);
  }
  onClickInside(event: MouseEvent) {
    event.stopPropagation();
  }
}
