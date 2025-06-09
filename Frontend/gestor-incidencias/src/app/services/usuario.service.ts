import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioNuevo {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'tecnic' | 'basic';
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  crearUsuario(usuario: UsuarioNuevo): Observable<any> {
    return this.http.post(`${this.apiUrl}`, usuario);
  }

  obtenerUsuarioPorId(id: string): Observable<UsuarioNuevo> {
    return this.http.get<UsuarioNuevo>(`${this.apiUrl}/${id}`);
  }

  actualizarUsuario(id: string, datos: Partial<UsuarioNuevo>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, datos);
  }

  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}
