import { Injectable } from '@angular/core';

export interface Usuario {
  username: string;
  fullName: string;
  email: string;
  role: 'admin' | 'tecnic' | 'basic';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActual: Usuario | null = {
    username: 'arielus',
    fullName: 'Lucas Lugo',
    email: 'lugo@example.com',
    role: 'admin'
  };

  obtenerUsuarioAutenticado(): Usuario | null {
    return this.usuarioActual;
  }

  iniciarSesion(usuario: Usuario) {
    this.usuarioActual = usuario;
  }

  cerrarSesion() {
    this.usuarioActual = null;
  }
}
