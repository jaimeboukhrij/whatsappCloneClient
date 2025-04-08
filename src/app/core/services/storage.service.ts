import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  setItem<T>(key: string, data: T): void {
    localStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        data
      })
    )
  }

  getItem<T>(key: string): { timestamp: number, data: T } | null {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }

  removeItem (key: string): void {
    localStorage.removeItem(key)
  }

  clear (): void {
    localStorage.clear()
  }
}
