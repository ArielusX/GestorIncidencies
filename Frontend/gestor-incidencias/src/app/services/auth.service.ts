import { Injectable } from '@angular/core';

export interface Usuario {
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: 'admin' | 'tecnic' | 'basic';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarios: Usuario[] = [
    { username: 'admin', fullName: 'Admin', email: 'admin@example.com', password: 'admin', role: 'admin' },
    { username: 'tecnic1', fullName: 'Tecnic 1', email: 'tecnic1@example.com', password: '1234', role: 'tecnic' },
    { username: 'basic1', fullName: 'Usuari Bàsic', email: 'basic1@example.com', password: 'abcd', role: 'basic' }
  ];

  private usuarioActual: Usuario | null = null;

  iniciarSesion(username: string, password: string): boolean {
    const user = this.usuarios.find(u => u.username === username && u.password === password);
    if (user) {
      this.usuarioActual = user;
      return true;
    }
    return false;
  }

  obtenerUsuarioAutenticado(): Usuario | null {
    return this.usuarioActual;
  }

  cerrarSesion() {
    this.usuarioActual = null;
  }
}
