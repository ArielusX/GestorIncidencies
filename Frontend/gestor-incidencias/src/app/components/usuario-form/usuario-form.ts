import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class UsuarioForm {
  form: FormGroup;
  enviado = false;
  error = '';
  rol: String = '';

  roles = ['admin', 'tecnic', 'basic'];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      role: ['basic', Validators.required],
    });
  }

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuarioAutenticado();
    if (usuario?.role) {
      this.rol = usuario.role;
    }
  }
  crearUsuario() {
    this.enviado = true;
    if (this.form.invalid) return;

    this.usuarioService.crearUsuario(this.form.value).subscribe({
      next: () => this.router.navigate(['/usuarios/listar']),
      error: (err) =>
        (this.error = err.error.message || 'Error al crear el usuario'),
    });
  }
}
