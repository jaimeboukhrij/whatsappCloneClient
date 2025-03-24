import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-pinned-icon',
  standalone: false,

  templateUrl: './pinned-icon.component.html',
  styles: ``,
})
export class PinnedIconComponent {
  @Input() iconColor = '#8696A0';
}
