import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-profile',
  standalone: false,

  templateUrl: './profile-icon.component.html',
  styles: [
    `
      img {
        clip-path: circle();
      }
    `,
  ],
})
export class ProfileIconComponent {
  @Input() public profile_img_url = '/assets/images/profile_img.jpeg';
}
