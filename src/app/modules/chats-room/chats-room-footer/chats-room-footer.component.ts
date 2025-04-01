import { Component } from '@angular/core';

@Component({
  selector: 'chats-room-footer',
  standalone: false,
  templateUrl: './chats-room-footer.component.html',
  styleUrl: './chats-room-footer.component.css',
})
export class ChatsRoomFooterComponent {
  autoExpand(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = '40px'; // Restablece la altura mínima
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta la altura al contenido
  }
}
