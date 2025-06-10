import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService, UsuarioNuevo } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuario-edit',
  templateUrl: 'usuario-edit.html',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
})
export class UsuarioEditarComponent implements OnInit {
  form: FormGroup;
  id!: string;
  enviado = false;
  error = '';
  roles = ['admin', 'tecnic', 'basic'];
    rol: String = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
        private authService: AuthService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuarioAutenticado();
    if (usuario?.role) {
      this.rol = usuario.role;
    }
    this.id = this.route.snapshot.params['id'];
    this.usuarioService.obtenerUsuarioPorId(this.id).subscribe({
      next: usuario => this.form.patchValue(usuario),
      error: err => this.error = 'Error al cargar el usuario'
    });
  }

  actualizarUsuario() {
    this.enviado = true;
    if (this.form.invalid) return;

    this.usuarioService.actualizarUsuario(this.id, this.form.value).subscribe({
      next: () => this.router.navigate(['/usuarios/listar']),
      error: err => this.error = 'Error al actualizar usuario'
    });
  }

  eliminarUsuario() {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    this.usuarioService.eliminarUsuario(this.id).subscribe({
      next: () => this.router.navigate(['/usuarios/listar']),
      error: err => this.error = 'Error al eliminar usuario'
    });
  }
}
