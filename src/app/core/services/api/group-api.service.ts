import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class GroupApiService {
  constructor(private readonly apiService: ApiService) {}
}
