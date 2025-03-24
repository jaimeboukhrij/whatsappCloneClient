import { Component } from '@angular/core';

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
  ]
})
export class ProfileIconComponent {
  public profile_img_url:string = '/assets/images/profile_img.jpeg'

}
