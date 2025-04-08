// src/app/services/socket.service.ts
import { Injectable } from '@angular/core'
import { Manager, type Socket } from 'socket.io-client'
import { BehaviorSubject, Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SocketStatusService {
  private socket: Socket | null = null
  private readonly connected$ = new BehaviorSubject(false)

  connect (token: string): void {
    const manager = new Manager(environment.SOCKET_URL, {
      extraHeaders: {
        token
      }
    })

    this.socket = manager.socket('/')

    this.socket.on('connect', () => {
      this.connected$.next(true)
    })

    this.socket.on('disconnect', () => {
      this.connected$.next(false)
    })
  }

  disconnect (): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  isConnected$ (): Observable<boolean> {
    return this.connected$.asObservable()
  }

  emit<T>(event: string, payload: T): void {
    this.socket?.emit(event, payload)
  }

  on<T>(event: string, callback: (data: T) => void): void {
    this.socket?.on(event, callback)
  }
}
