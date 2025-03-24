import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-settings',
  standalone: false,

  templateUrl: './settings-icon.component.html',
  styles: ``
})
export class SettingsIconComponent {
  @Input()iconColor:string = ''

}
