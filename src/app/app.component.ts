import { Component } from '@angular/core'
import {  StorageService } from './core/services/storage.service'

@Component({
  selector: 'app-root',
  template: ' <router-outlet /> ',
  standalone: false
})
export class AppComponent {
  constructor (private readonly storageService: StorageService) {}
}
