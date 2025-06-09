// src/app/services/incidencia.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incidencia } from '../models/incidencia.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class IncidenciaService {
  private apiUrl = 'http://localhost:3000/api/incidencias';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const user = this.authService.obtenerUsuarioAutenticado();
    const token = user?.token || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getIncidencias(): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  crearIncidencia(incidencia: Incidencia): Observable<Incidencia> {
    return this.http.post<Incidencia>(this.apiUrl, incidencia, {
      headers: this.getAuthHeaders(),
    });
  }

  eliminarIncidencia(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  actualizarIncidencia(id: string, incidencia: Incidencia): Observable<Incidencia> {
    return this.http.put<Incidencia>(`${this.apiUrl}/${id}`, incidencia, {
      headers: this.getAuthHeaders(),
    });
  }

  getIncidenciaById(id: string): Observable<Incidencia> {
    return this.http.get<Incidencia>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
