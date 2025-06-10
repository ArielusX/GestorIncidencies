// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Usuario {
  username: string;
  fullName?: string;
  email: string;
  password: string;
  role?: 'admin' | 'tecnic' | 'basic';
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.obtenerUsuarioLocalStorage());

  constructor(private http: HttpClient) {}

  private obtenerUsuarioLocalStorage(): Usuario | null {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  }

  iniciarSesion(username: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((user) => {
        localStorage.setItem('usuario', JSON.stringify(user));
        if (user.token) {
          localStorage.setItem('token', user.token);
        }
        this.usuarioSubject.next(user);  // 🔁 Emite el nuevo usuario
      })
    );
  }

  obtenerUsuarioAutenticado(): Usuario | null {
    return this.usuarioSubject.value;
  }

  getUsuarioObservable(): Observable<Usuario | null> {
    return this.usuarioSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return !!this.usuarioSubject.value;
  }

  getUserRole(): 'admin' | 'tecnic' | 'basic' | null {
    return this.usuarioSubject.value?.role ?? null;
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.usuarioSubject.next(null);  
  }
}

