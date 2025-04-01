import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'chat-header',
  standalone: false,

  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css',
})
export class ChatHeaderComponent {
  public iconColor = '#ADBAC1';

  constructor(private readonly router: Router) {}

  onContactsIconClick() {
    this.router.navigate(['/contacts']);
  }
}
