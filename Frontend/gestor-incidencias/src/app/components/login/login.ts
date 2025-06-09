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
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.iniciarSesion(this.username, this.password).subscribe({
      next: (user) => {
        // Login exitoso, navega al dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Error, muestra mensaje
        this.error = 'Usuari o contrasenya incorrectes';
        console.error('Error de login', err);
      },
    });
  }
}
