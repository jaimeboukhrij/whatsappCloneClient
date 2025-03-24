import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected baseUrl = environment.apiUrl
  protected headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(protected http: HttpClient) { }

  fetchApi<T>(
    endpoint: string,
    body?: unknown,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET'
  ): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;

    switch (method) {
      case 'POST':
        return this.http.post<T>(url, body, { headers: this.headers });
      case 'PATCH':
        return this.http.patch<T>(url, body, { headers: this.headers });
      case 'DELETE':
        return this.http.delete<T>(url, { headers: this.headers });
      default:
        return this.http.get<T>(url, { headers: this.headers });
    }
  }
}
