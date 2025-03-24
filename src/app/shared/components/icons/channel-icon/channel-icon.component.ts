import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-chanel',
  standalone: false,

  templateUrl: './channel-icon.component.html',
  styles: ``
})
export class ChannelIconComponent {
  @Input()iconColor:string = ''

}
