// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { Manager, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketStatusService {
  private socket: Socket | null = null;
  private connected$ = new BehaviorSubject(false);

  connect(token: string) {
    const manager = new Manager(environment.SOCKET_URL, {
      extraHeaders: {
        token,
      },
    });

    this.socket = manager.socket('/');

    this.socket.on('connect', () => {
      this.connected$.next(true);
    });

    this.socket.on('disconnect', () => {
      this.connected$.next(false);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected$() {
    return this.connected$.asObservable();
  }

  emit<T>(event: string, payload: T) {
    console.log('emit', event, payload, this.socket);
    this.socket?.emit(event, payload);
  }

  on<T>(event: string, callback: (data: T) => void) {
    this.socket?.on(event, callback);
  }
}
