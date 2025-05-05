import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class UtilsService {
  public getCoordinates (event: MouseEvent): { x: number, y: number } {
    const target = event.target as HTMLElement
    const rect = target.getBoundingClientRect()

    return { x: rect.left, y: rect.top }
  }

  public checkIfElementIsBelow (event: MouseEvent, elementHeight = 0): boolean {
    const element = event?.target as HTMLElement
    if (!element) return false

    const rect = element.getBoundingClientRect()
    const elementBottom = rect.bottom + elementHeight
    const viewportBottom = window.innerHeight
    return elementBottom > viewportBottom
  }

  public isElementOutOfViewport (event: MouseEvent, offset = 0): boolean {
    const element = event?.target as HTMLElement
    if (!element) return false

    const rect = element.getBoundingClientRect()

    return (
      rect.left + offset > window.innerWidth ||
      rect.left < 0
    )
  }

  formatLastSeen (date: Date): string {
    const now = new Date()
    const d = new Date(date)

    const isToday =
      now.toDateString() === d.toDateString()

    const yesterday = new Date()
    yesterday.setDate(now.getDate() - 1)
    const isYesterday =
      yesterday.toDateString() === d.toDateString()

    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    }

    const time = d.toLocaleTimeString('es-ES', optionsTime)

    if (isToday) return `hoy a las ${time}`
    if (isYesterday) return `ayer a las ${time}`

    const optionsDate: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long'
    }

    const datePart = d.toLocaleDateString('es-ES', optionsDate)

    if (now.getFullYear() === d.getFullYear()) {
      return `${datePart} a las ${time}`
    }

    return `${datePart} de ${d.getFullYear()} a las ${time}`
  }

}
