/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core'
import {
  type HttpEvent,
  type HttpHandler,
  type HttpInterceptor,
  type HttpRequest
} from '@angular/common/http'
import { type Observable } from 'rxjs'
import { StorageService } from '../services/storage.service'

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private readonly storageService = inject(StorageService)
  intercept (
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = this.storageService.getItem('jwtToken')?.data as string
    if (Boolean(token)) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
      return next.handle(cloned)
    }

    return next.handle(req)
  }
}
