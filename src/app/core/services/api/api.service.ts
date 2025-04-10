import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError,  Observable, throwError } from 'rxjs'
import { environment } from '../../../../environments/environment'
import {  StorageService } from '../storage.service'
import {  Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected baseUrl = environment.apiUrl
  protected headers = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor (
    protected http: HttpClient,
    private readonly storageService: StorageService,
    private readonly router: Router
  ) {}

  fetchApi<T>(
    endpoint: string,
    body?: unknown,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT' = 'GET',
    isFileUpload = false
  ): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`
    let request$: Observable<T>
    const options = isFileUpload
      ? {
          headers: new HttpHeaders()
          // No se establece 'Content-Type' cuando se usa FormData
        }
      : { headers: this.headers }

    // Si estamos enviando archivos, usar FormData
    if (isFileUpload && body instanceof FormData) {
      // Si el body es FormData, no hay que hacer nada, se usará tal cual
    } else if (body && !isFileUpload) {
      // Si no es un archivo, aseguramos que el body esté en formato JSON
      body = JSON.stringify(body)
    }

    switch (method) {
      case 'POST':
        request$ = this.http.post<T>(url, body, options)
        break
      case 'PATCH':
        request$ = this.http.patch<T>(url, body, options)
        break
      case 'DELETE':
        request$ = this.http.delete<T>(url, options)
        break
      case 'PUT':
        request$ = this.http.put<T>(url, body, options)
        break
      default:
        request$ = this.http.get<T>(url, options)
    }

    return request$.pipe(catchError(this.handleError))
  }

  private readonly handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred'

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.message}`
    } else {
      if (error.status === 401) {
        this.storageService.clear()
        this.router.navigate(['auth/login'])
      }
      errorMessage = `Server Error (${error.status}): ${error.message}`
    }

    return throwError(() => new Error(errorMessage))
  }
}
