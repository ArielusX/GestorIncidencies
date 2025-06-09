// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface Usuario {
  username: string;
  fullName?: string;
  email: string;
  password: string;
  role?: 'admin' | 'tecnic' | 'basic';
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private usuarioActual: Usuario | null = null;

  constructor(private http: HttpClient) {}

  iniciarSesion(username: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(user => {
        this.usuarioActual = user;
        localStorage.setItem('usuario', JSON.stringify(user)); // Guardamos el usuario
      })
    );
  }

obtenerUsuarioAutenticado(): Usuario | null {
  if (!this.usuarioActual) {
    const guardado = localStorage.getItem('usuario');
    if (guardado) {
      this.usuarioActual = JSON.parse(guardado);
    }
  }
  console.log(this.usuarioActual)
  return this.usuarioActual;
}

  cerrarSesion() {
    this.usuarioActual = null;
    localStorage.removeItem('usuario');
  }
}
