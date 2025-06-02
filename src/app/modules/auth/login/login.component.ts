import { Component } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-whatsapp-login',
  standalone: false,
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email: string = ''
  password: string = ''
  showPassword: boolean = false
  isLoading: boolean = false

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

  togglePasswordVisibility (): void {
    this.showPassword = !this.showPassword
  }

  handleSubmit (): void {
    this.isLoading = true

    // Simulamos una llamada de autenticación
    setTimeout(() => {
      this.isLoading = false
      console.log('Login attempt:', { email: this.email, password: this.password })
    }, 2000)
  }
}