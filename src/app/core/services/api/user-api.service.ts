import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IUser } from '../../interfaces/user.interface';

@Injectable({providedIn: 'root'})
export class UserApiService {
  constructor(private readonly http: HttpClient, private readonly apiService:ApiService) { }


   getApiUsers(){
    return this.apiService.fetchApi<IUser[]>('/users')
  }

}