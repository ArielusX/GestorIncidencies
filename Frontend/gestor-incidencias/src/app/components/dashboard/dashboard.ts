import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { IncidenciaService } from '../../services/incidencia.service';
import { Incidencia } from '../../models/incidencia.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule, RouterModule]
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
      }
    });
  }

  calcularTopTecnics() {
    const tecnicCount: { [key: string]: number } = {};
    this.incidencias.forEach(i => {
      if (i.estado === 'tancada' && i.tecnico) {
        tecnicCount[i.tecnico] = (tecnicCount[i.tecnico] || 0) + 1;
      }
    });

    this.tecnicsTop5 = Object.entries(tecnicCount)
      .map(([nombre, incidenciasTancades]) => ({ nombre, incidenciasTancades }))
      .sort((a, b) => b.incidenciasTancades - a.incidenciasTancades)
      .slice(0, 5);
  }

  getIncidenciesAssignades(): Incidencia[] {
    return this.incidencias.filter(i => i.tecnico === this.username);
  }

  getIncidenciesUsuari(): Incidencia[] {
    return this.incidencias.filter(i => i.usuarioCreador === this.username);
  }

  getIncidenciasByEstado(estado: string): number {
    if (!this.incidencias) return 0;
    return this.incidencias.filter(inc => inc.estado === estado).length;
  }

  getEstadisticas() {
    const total = this.incidencias.length;
    const tancades = this.getIncidenciasByEstado('tancada');
    const assignades = this.getIncidenciasByEstado('assignada');
    const obertes = this.getIncidenciasByEstado('oberta');
    const solucionades = this.getIncidenciasByEstado('solucionada');

    return {
      total,
      tancades,
      assignades,
      obertes,
      solucionades,
      tecnicActius: this.tecnicsTop5.length
    };
  }

  getPrioridadDisplay(prioridad: string): string {
    const priorityMap: { [key: string]: string } = {
      'crítica': 'Crítica',
      'alta': 'Alta',
      'mitja': 'Mitjana',
      'baixa': 'Baixa'
    };
    return priorityMap[prioridad] || prioridad;
  }


  getEstadoDisplay(estado: string): string {
    const statusMap: { [key: string]: string } = {
      'oberta': 'Oberta',
      'assignada': 'Assignada',
      'solucionada': 'Solucionada',
      'tancada': 'Tancada'
    };
    return statusMap[estado] || estado;
  }

 
  getPrioridadColor(prioridad: string): string {
    const colorMap: { [key: string]: string } = {
      'crítica': 'danger',
      'alta': 'warning',
      'mitja': 'info',
      'baixa': 'secondary'
    };
    return colorMap[prioridad] || 'secondary';
  }


  getEstadoColor(estado: string): string {
    const colorMap: { [key: string]: string } = {
      'oberta': 'secondary',
      'assignada': 'warning',
      'solucionada': 'info',
      'tancada': 'success'
    };
    return colorMap[estado] || 'secondary';
  }


  getEstadoIcon(estado: string): string {
    const iconMap: { [key: string]: string } = {
      'oberta': 'fa-plus',
      'assignada': 'fa-clock',
      'solucionada': 'fa-wrench',
      'tancada': 'fa-check'
    };
    return iconMap[estado] || 'fa-question';
  }


  getTecnicProgress(incidenciasTancades: number): number {
    if (this.tecnicsTop5.length === 0) return 0;
    const max = this.tecnicsTop5[0].incidenciasTancades;
    return max === 0 ? 0 : (incidenciasTancades / max) * 100;
  }

  getIncidenciesRecents(): Incidencia[] {
    return [...this.incidencias]
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
      .slice(0, 5);
  }


  getIncidenciesUrgents(): Incidencia[] {
    return this.incidencias.filter(i => 
      (i.prioridad === 'crítica' || i.prioridad === 'alta') && 
      (i.estado === 'oberta' || i.estado === 'assignada')
    );
  }


  hayCriticasSinAsignar(): boolean {
    return this.incidencias.some(i => 
      i.prioridad === 'crítica' && 
      i.estado === 'oberta' && 
      !i.tecnico
    );
  }

  eliminarIncidencia(id: string) {
  if(confirm('¿Estás seguro que querés eliminar esta incidencia?')) {
    this.incidenciaService.eliminarIncidencia(id).subscribe({
      next: () => {
        alert('Incidencia eliminada');
        this.cargarIncidencias();
      },
      error: (err) => {
        console.error(err);
        alert('Error al eliminar la incidencia');
      }
    });
  }
}


}