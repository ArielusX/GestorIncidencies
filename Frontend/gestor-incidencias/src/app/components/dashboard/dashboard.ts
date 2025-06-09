import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { IncidenciaService } from '../../services/incidencia.service';
import { Incidencia } from '../../models/incidencia.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  rol: string = '';
  username: string = '';

  incidencias: Incidencia[] = [];
  tecnicsTop5: { nombre: string; incidenciasTancades: number }[] = [];
  estats: string[] = ['oberta', 'assignada', 'solucionada', 'tancada'];

  constructor(
    private authService: AuthService,
    private incidenciaService: IncidenciaService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuarioAutenticado();
    if (usuario?.role) {
      this.rol = usuario.role;
      this.username = usuario.username;
    }
    console.log('Usuario cargado:', this.username);
    this.cargarIncidencias();
  }

  cargarIncidencias() {
    this.incidenciaService.getIncidencias().subscribe({
      next: (data) => {
        this.incidencias = data;
        this.calcularTopTecnics();
      },
      error: (error) => {
        console.error('Error cargando incidencias:', error);
        // Si querés, podés fallbackear a mock en caso de error
        // this.incidencias = [ ...mock data... ];
      }
    });
  }

  calcularTopTecnics() {
    const tecnicCount: { [key: string]: number } = {};
    this.incidencias.forEach(i => {
      if (i.estado === 'tancada' && i.usuarioAsignado) {
        tecnicCount[i.usuarioAsignado] = (tecnicCount[i.usuarioAsignado] || 0) + 1;
      }
    });

    this.tecnicsTop5 = Object.entries(tecnicCount)
      .map(([nombre, incidenciasTancades]) => ({ nombre, incidenciasTancades }))
      .sort((a, b) => b.incidenciasTancades - a.incidenciasTancades)
      .slice(0, 5);
  }

  getIncidenciesAssignades(): Incidencia[] {
    return this.incidencias.filter(i => i.usuarioAsignado === this.username);
  }

  getIncidenciesUsuari(): Incidencia[] {
    return this.incidencias.filter(i => i.usuarioCreador === this.username);
  }
}
