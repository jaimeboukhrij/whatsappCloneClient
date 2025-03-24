import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-search-icon',
  standalone: false,

  templateUrl: './search-icon.component.html',
  styles: ``,
})
export class SearchIconComponent {
  @Input() iconColor: string = '#8696A0';
}
