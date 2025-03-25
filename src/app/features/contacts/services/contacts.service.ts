import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { ContactInterface } from '../model';
import { debounceTime, Subject } from 'rxjs';
import { ContactApiService } from '../../../core/services/api';
import { IUser } from '../../../shared/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private storageService = inject(StorageService);
  private contactApiService = inject(ContactApiService);

  private searchQuery$ = new Subject<string>();
  private firstLetterSet = new Set<string>();
  private originalContactData = signal<IUser[]>([]);
  public contactsData = signal<ContactInterface[]>([]);
  public isChatInputLoading = signal(false);

  constructor() {
    this.filterByQuery();
  }

  public getContactsData(): void {
    const storedData =
      this.storageService.getItem<ContactInterface[]>('contactsData');

    if (storedData && Date.now() - storedData.timestamp < 60 * 60 * 1000) {
      this.contactsData.set(storedData.data);
      console.log(storedData);
      this.originalContactData.set(
        this.getUserDataFromContact(storedData.data)
      );
      return;
    }

    this.contactApiService.getApiContacts().subscribe((contacts) => {
      const transformedContactsData = this.transformContactsData(contacts);
      this.contactsData.set(transformedContactsData);
      this.storageService.setItem('contactsData', transformedContactsData);

      this.originalContactData.set(contacts);
    });
  }

  private filterByQuery(): void {
    this.searchQuery$.pipe(debounceTime(200)).subscribe((query) => {
      this.isChatInputLoading.set(false);
      if (!query) {
        this.contactsData.set(
          this.transformContactsData(this.originalContactData())
        );
        return;
      }
      this.filterContactsDataByQuery(query);
    });
  }

  onInputQueryChange(query: string) {
    this.isChatInputLoading.set(true);
    this.searchQuery$.next(query);
  }

  private filterContactsDataByQuery(query: string) {
    const upperQuery = query.toUpperCase();
    const contactsFilterByQuery = this.originalContactData().filter(
      ({ firstName }) => firstName.toUpperCase().includes(upperQuery)
    );

    this.contactsData.set(this.transformContactsData(contactsFilterByQuery));
  }

  private transformContactsData(contacts: IUser[]) {
    this.getFirstLettersOfContactData(contacts);
    return this.getSortedContactDataByLetter(contacts);
  }

  private getFirstLettersOfContactData(contacts: IUser[]) {
    this.firstLetterSet.clear();
    contacts
      .sort((a, b) => a.firstName.localeCompare(b.firstName))
      .forEach((contact) => this.firstLetterSet.add(contact.firstName[0]));
  }

  private getSortedContactDataByLetter(contacts: IUser[]) {
    const sortedContactsDataByLetter: ContactInterface[] = [];

    this.firstLetterSet.forEach((letter) => {
      const filterContacts = contacts.filter(
        (elem) => elem.firstName[0].toUpperCase() === letter.toUpperCase()
      );
      if (filterContacts.length)
        sortedContactsDataByLetter.push({ letter, data: filterContacts });
    });

    return sortedContactsDataByLetter;
  }

  private getUserDataFromContact(contacts: ContactInterface[]): IUser[] {
    const contactData: IUser[] = [];
    contacts.forEach((contact) => contactData.push(...contact.data));
    return contactData;
  }
}
