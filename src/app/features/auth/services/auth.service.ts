import { Injectable } from '@angular/core';
import { AuthApiService } from '../../../core/services/api';
import { tap } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';
import { Router } from '@angular/router';

interface LoginI {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly authApiService: AuthApiService,
    private readonly storageService: StorageService,
    private router: Router
  ) {}

  login(data: LoginI) {
    this.authApiService
      .login(data)
      .pipe(tap((user) => this.storageService.setItem('jwtToken', user.token)))
      .subscribe({
        next: () => {
          this.router.navigate(['chats']);
        },
        error(err) {
          console.warn(err);
        },
      });
  }

  isAuthenticated() {
    const jwtToken = this.storageService.getItem('jwtToken');
    return jwtToken ? true : false;
  }

  logOut() {
    this.storageService.clear();
    this.router.navigate(['auth/login']);
  }
}
