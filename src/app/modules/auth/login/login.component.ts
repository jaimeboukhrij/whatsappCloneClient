import { Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styles: ''
})
export class LoginComponent {
  constructor (private readonly authService: AuthService) {}

  public loginForm = new FormGroup({
    email: new FormControl('adrian.martinez@example.com', [
      Validators.email,
      Validators.required
    ]),
    password: new FormControl('Abc123', [
      Validators.required,
      Validators.minLength(3)
    ])
  })

  onSubmit () {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value
      if (email && password) {
        this.authService.login({ email, password })
      } else {
        console.error('Email or password is missing')
      }
    }
  }
}
