import { StorageService } from './../../../core/services/storage.service';
import { Injectable, signal } from '@angular/core';
import { IUser } from '../../../shared/interfaces/user.interface';
import { UserApiService } from '../../../core/services/api';
import { debounceTime, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AddNewcontactService {
  showNewContactModal = signal(false);
  usersRecommended = signal<IUser[]>([]);
  userFindByQuery = signal<IUser[]>([]);
  query = signal('');
  searchQuery$ = new Subject<string>();
  isDataLoading = signal(false);

  constructor(
    private readonly userApisService: UserApiService,
    private readonly storageService: StorageService
  ) {
    this.searchQuery$.pipe(debounceTime(300)).subscribe((query) => {
      this.query.set(query);
      if (!query) {
        this.userFindByQuery.set([]);
        this.isDataLoading.set(false);

        return;
      }
      this.getUsersByQuery(query);
    });
  }

  getUsersRecommended() {
    const storedData = this.storageService.getItem<IUser[]>(
      'contactsRecommended'
    );

    if (storedData && Date.now() - storedData.timestamp < 60 * 60 * 1000) {
      this.usersRecommended.set(storedData.data);
      return;
    }
    this.userApisService.getUsersRecommended().subscribe({
      next: (users) => {
        this.storageService.setItem<IUser[]>('contactsRecommended', users);
        this.usersRecommended.set(users);
      },
      error(err) {
        console.warn(err);
      },
      complete: () => {
        this.isDataLoading.set(false);
      },
    });
  }

  onChangeQueryInput(query: string) {
    this.isDataLoading.set(true);
    this.searchQuery$.next(query);
  }

  getUsersByQuery(q: string) {
    this.userApisService.getApiUsersByUserName(q).subscribe((users) => {
      this.userFindByQuery.set(users);
      this.isDataLoading.set(false);
    });
  }
}
