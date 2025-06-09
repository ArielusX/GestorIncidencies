import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    // Limpiar error anterior y activar loading
    this.error = '';
    this.isLoading = true;

    this.authService.iniciarSesion(this.username, this.password).subscribe({
      next: (user) => {
        // Login exitoso, navega al dashboard
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Error, muestra mensaje y desactiva loading
        this.isLoading = false;
        this.error = 'Usuari o contrasenya incorrectes';
        console.error('Error de login', err);
      },
    });
  }

  // Método para mostrar/ocultar contraseña  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}