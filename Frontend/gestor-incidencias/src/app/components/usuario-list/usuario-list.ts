import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.css'
})
export class UsuarioList implements OnInit {
  usuarios: any[] = [];
  error: string = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: () => this.error = 'Error al obtener los usuarios'
    });
  }

  editarUsuario(id: string) {
    this.router.navigate(['/usuarios/editar', id]);
  }

  eliminarUsuario(id: string) {
    if (confirm('¿Seguro que quieres eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => this.obtenerUsuarios(),
        error: () => this.error = 'Error al eliminar el usuario'
      });
    }
  }
}
