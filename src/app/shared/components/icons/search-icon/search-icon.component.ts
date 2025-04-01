import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-search-icon',
  standalone: false,

  templateUrl: './search-icon.component.html',
  styles: ``,
})
export class SearchIconComponent {
  @Input() iconColor = '#8696A0';
  @Input() width = '24';
  @Input() height = '24';
}
