import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilsService {
  public getCoordinates(event: MouseEvent): { x: number; y: number } {
    const target = event.target as HTMLElement;

    const rect = target.getBoundingClientRect();

    const absoluteX = rect.left + window.scrollX;
    const absoluteY = rect.top + window.scrollY;

    return { x: absoluteX, y: absoluteY };
  }

  public checkIfElementIsBelow(event: MouseEvent, elementHeight = 0): boolean {
    const element = event?.target as HTMLElement;
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const elementBottom = rect.bottom + elementHeight;
    const viewportBottom = window.innerHeight;
    return elementBottom > viewportBottom;
  }
}
