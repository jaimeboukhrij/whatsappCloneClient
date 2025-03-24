import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-loading-spinner',
  standalone: false,

  templateUrl: './loading-spinner.component.html',
  styles: ``,
})
export class LoadingSpinnerComponent {
  @Input() size: string = '30px';
  @Input() color: string = '#04A784';
}
