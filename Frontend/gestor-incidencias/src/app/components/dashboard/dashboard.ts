import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IncidenciaService } from '../../services/incidencia.service';
import { Incidencia } from '../../models/incidencia.model';
import { RouterModule } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class DashboardComponent implements OnInit {
  rol: string = '';
  username: string = '';

  incidencias: Incidencia[] = [];
  tecnicsTop5: { nombre: string; incidenciasTancades: number }[] = [];
  estats: string[] = ['oberta', 'assignada', 'solucionada', 'tancada'];

  vistaActual: string = ''; 
  filtroEstado: string = ''; 
  incidenciaSeleccionada: Incidencia | null = null;
  textoSolucion: string = '';

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
        if (this.rol === 'admin') {
          this.calcularTopTecnics();
          this.vistaActual='totes';
        }else if (this.rol === 'tecnic'){
          this.vistaActual='assignades';
        }
        
      },
      error: (error) => {
        console.error('Error cargando incidencias:', error);
      },
    });
  }

  calcularTopTecnics() {
    const tecnicCount: { [key: string]: number } = {};
    this.incidencias.forEach((i) => {
      if (i.estado === 'tancada' && i.tecnico) {
        tecnicCount[i.tecnico] = (tecnicCount[i.tecnico] || 0) + 1;
      }
    });

    this.tecnicsTop5 = Object.entries(tecnicCount)
      .map(([nombre, incidenciasTancades]) => ({ nombre, incidenciasTancades }))
      .sort((a, b) => b.incidenciasTancades - a.incidenciasTancades)
      .slice(0, 5);
  }


  getIncidenciesUsuariByEstado(estado: string): number {
    return this.getIncidenciesUsuari().filter((i) => i.estado === estado).length;
  }

  getIncidenciesUsuariVisible(): Incidencia[] {
    let incidencias = this.getIncidenciesUsuari();
    
    if (this.filtroEstado) {
      incidencias = incidencias.filter((i) => i.estado === this.filtroEstado);
    }
    
    // Ordenar por fecha de creación (más recientes primero)
    return incidencias.sort((a, b) => 
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );
  }
  getIncidenciesAssignades(): Incidencia[] {
    return this.incidencias.filter((i) => i.tecnico === this.username);
  }
  getIncidenciasFiltradas(): Incidencia[] {
    return this.incidencias.filter((i) => i.usuarioCreador === this.username);
  }

  getIncidenciesObertes(): Incidencia[] {
    return this.incidencias.filter((i) => i.estado === 'oberta');
  }
  getIncidencies(): Incidencia[] {
    return this.incidencias;
  }

  getIncidenciesAssignadesByEstado(estado: string): number {
    return this.getIncidenciesAssignades().filter((i) => i.estado === estado)
      .length;
  }

  getIncidenciesVisible(): Incidencia[] {
    let incidencias: Incidencia[] = [];

    if (this.vistaActual === 'assignades') {
      incidencias = this.getIncidenciesAssignades();

      // Aplicar filtro por estado si está seleccionado
      if (this.filtroEstado) {
        incidencias = incidencias.filter((i) => i.estado === this.filtroEstado);
      }
    } else if (this.vistaActual === 'obertes') {
      incidencias = this.getIncidenciesObertes();
    } else if (this.vistaActual === 'totes') {
      incidencias = this.getIncidencies();
      if (this.filtroEstado) {
        incidencias = incidencias.filter((i) => i.estado === this.filtroEstado);
      } 
    }

    return incidencias;
  }

  getDescripcionVista(): string {
    if (this.vistaActual === 'assignades') {
      const total = this.getIncidenciesAssignades().length;
      if (this.filtroEstado) {
        return `Incidències assignades amb estat: ${this.getEstadoDisplay(
          this.filtroEstado
        )}`;
      }
      return `${total} incidències assignades a tu`;
    } else if (this.vistaActual === 'obertes') {
      const total = this.getIncidenciesObertes().length;
      return `${total} incidències obertes disponibles per assignar`;
    } else {
      const total = this.getIncidencies().length;
      if (this.filtroEstado) {
        return `Incidències amb estat: ${this.getEstadoDisplay(
          this.filtroEstado
        )}`;
      } else {
        return `${total} incidències totals`;
      }
    }
  }

  getProgressWidth(estado: string): number {
    const total = this.getIncidenciesAssignades().length;
    if (total === 0) return 0;

    const count = this.getIncidenciesAssignadesByEstado(estado);
    return (count / total) * 100;
  }
  getProgressWidthAdmin(estado: string): number {
    const total = this.incidencias.length;
    if (total === 0) return 0;

    const count = this.getIncidenciasByEstado(estado);
    return (count / total) * 100;
  }

    getProgressWidthUsuari(estado: string): number {
       const total = this.getIncidenciesUsuari().length;

    if (total === 0) return 0;

    const count = this.getIncidenciesUsuariByEstado(estado);
    return (count / total) * 100;
  }

  // Métodos de acción para técnico
  assignarseIncidencia(incidenciaId: string) {
    if (confirm('Vols assignar-te aquesta incidència?')) {
      this.incidenciaService.getIncidenciaById(incidenciaId).subscribe({
        next: (incidencia) => {
          const incidenciaActualizada: Incidencia = {
            ...incidencia,
            estado: 'assignada',
            tecnico: this.username!,
          };

          this.incidenciaService
            .actualizarIncidencia(incidenciaId, incidenciaActualizada)
            .subscribe({
              next: () => {
                alert('Incidència assignada correctament');
                this.cargarIncidencias();
              },
              error: (error) => {
                console.error('Error al assignar incidència:', error);
                alert('Error al assignar la incidència');
              },
            });
        },
        error: (error) => {
          console.error('Error al obtenir la incidència:', error);
          alert("No s'ha pogut obtenir la incidència per actualitzar");
        },
      });
    }
  }

    mostrarModalSolucion(incidencia: Incidencia) {
    this.incidenciaSeleccionada = incidencia;
    this.textoSolucion = '';
    
    // Mostrar modal usando Bootstrap
    const modalElement = document.getElementById('modalSolucion');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }


/*confirmarSolucion(): void {
  console.log(incidencia)


  const incidenciaActualizada: Incidencia = {
    ...incidencia,
    estado: 'solucionada',
    fechaSolucion: new Date().toISOString(),
  };

  
  this.incidenciaService.actualizarIncidencia(
    incidencia._id!,
    incidenciaActualizada
  ).subscribe({
    next: (respuesta) => {
      alert('Incidència marcada com a solucionada correctament');
      this.cargarIncidencias(); 
      this.textoSolucion = '';
    },
    error: (error) => {
      console.error('Error al solucionar incidència:', error);
      alert('Error al marcar la incidència com a solucionada');
    }
  });
}*/

  confirmarSolucion() {
    if (!this.incidenciaSeleccionada || !this.textoSolucion.trim()) {
      return;
    }

  const incidenciaActualizada: Incidencia = {
    ...this.incidenciaSeleccionada,
    estado: 'solucionada',
    fechaSolucion: new Date(),
  };

    this.incidenciaService.actualizarIncidencia(this.incidenciaSeleccionada._id!, incidenciaActualizada).subscribe({
      next: () => {
        alert('Incidència marcada com a solucionada');
        this.cargarIncidencias();
        
        // Cerrar modal
        const modalElement = document.getElementById('modalSolucion');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }
        
        // Limpiar datos
        this.incidenciaSeleccionada = null;
        this.textoSolucion = '';
      },
      error: (error) => {
        console.error('Error al solucionar incidència:', error);
        alert('Error al marcar la incidència com a solucionada');
      }
    });
  }


  // Métodos comunes (admin y técnico)
  getIncidenciesUsuari(): Incidencia[] {
    return this.incidencias.filter((i) => i.usuarioCreador === this.username);
  }

  getIncidenciasByEstado(estado: string): number {
    if (!this.incidencias) return 0;
    return this.incidencias.filter((inc) => inc.estado === estado).length;
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
      tecnicActius: this.tecnicsTop5.length,
    };
  }

  getPrioridadDisplay(prioridad: string): string {
    const priorityMap: { [key: string]: string } = {
      crítica: 'Crítica',
      alta: 'Alta',
      mitja: 'Mitjana',
      baixa: 'Baixa',
    };
    return priorityMap[prioridad] || prioridad;
  }

  getEstadoDisplay(estado: string): string {
    const statusMap: { [key: string]: string } = {
      oberta: 'Oberta',
      assignada: 'Assignada',
      solucionada: 'Solucionada',
      tancada: 'Tancada',
    };
    return statusMap[estado] || estado;
  }

  getPrioridadColor(prioridad: string): string {
    const colorMap: { [key: string]: string } = {
      crítica: 'danger',
      alta: 'warning',
      mitja: 'info',
      baixa: 'secondary',
    };
    return colorMap[prioridad] || 'secondary';
  }

  getEstadoColor(estado: string): string {
    const colorMap: { [key: string]: string } = {
      oberta: 'secondary',
      assignada: 'warning',
      solucionada: 'info',
      tancada: 'success',
    };
    return colorMap[estado] || 'secondary';
  }

  getEstadoIcon(estado: string): string {
    const iconMap: { [key: string]: string } = {
      oberta: 'fa-plus',
      assignada: 'fa-clock',
      solucionada: 'fa-wrench',
      tancada: 'fa-check',
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
      .sort(
        (a, b) =>
          new Date(b.fechaCreacion).getTime() -
          new Date(a.fechaCreacion).getTime()
      )
      .slice(0, 5);
  }

  getIncidenciesUrgents(): Incidencia[] {
    return this.incidencias.filter(
      (i) =>
        (i.prioridad === 'crítica' || i.prioridad === 'alta') &&
        (i.estado === 'oberta' || i.estado === 'assignada')
    );
  }

  hayCriticasSinAsignar(): boolean {
    return this.incidencias.some(
      (i) => i.prioridad === 'crítica' && i.estado === 'oberta' && !i.tecnico
    );
  }

  eliminarIncidencia(id: string) {
    if (confirm('¿Estás seguro que querés eliminar esta incidencia?')) {
      this.incidenciaService.eliminarIncidencia(id).subscribe({
        next: () => {
          alert('Incidencia eliminada');
          this.cargarIncidencias();
        },
        error: (err) => {
          console.error(err);
          alert('Error al eliminar la incidencia');
        },
      });
    }
  }
}
