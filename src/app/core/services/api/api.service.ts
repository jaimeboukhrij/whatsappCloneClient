import { StorageService } from './../storage.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected baseUrl = environment.apiUrl;
  protected headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    protected http: HttpClient,
    private readonly storageService: StorageService
  ) {}

  fetchApi<T>(
    endpoint: string,
    body?: unknown,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET'
  ): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    let request$: Observable<T>;

    switch (method) {
      case 'POST':
        request$ = this.http.post<T>(url, body, { headers: this.headers });
        break;
      case 'PATCH':
        request$ = this.http.patch<T>(url, body, { headers: this.headers });
        break;
      case 'DELETE':
        request$ = this.http.delete<T>(url, { headers: this.headers });
        break;
      default:
        request$ = this.http.get<T>(url, { headers: this.headers });
    }

    return request$.pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.message}`;
    } else {
      if (error.status === 401) {
        console.warn('Unauthorized - Clearing LocalStorage');
        this.storageService.clear(); // Limpia el almacenamiento
      }
      errorMessage = `Server Error (${error.status}): ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  };
}
