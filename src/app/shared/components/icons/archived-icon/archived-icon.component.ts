import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-archived-icon',
  standalone: false,

  templateUrl: './archived-icon.component.html',
  styles: ``,
})
export class ArchivedIconComponent {
  @Input() iconColor = '#04A784';
}
