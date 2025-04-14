import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  constructor (private readonly apiService: ApiService) {}

  uploadImg (image: File): Observable<{ url: string }> {
    const formData = new FormData()
    formData.append('image', image)
    return this.apiService.fetchApi('/cloudinary/upload-image', formData, 'POST', true)
  }

}