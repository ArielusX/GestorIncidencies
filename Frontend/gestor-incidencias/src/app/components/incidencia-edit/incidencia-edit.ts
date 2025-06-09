import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-incidencia-edit',
  templateUrl: 'incidencia-edit.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class IncidenciaEdit implements OnInit {
  form!: FormGroup;
  id!: string;
  estados = ['oberta' , 'assignada' , 'solucionada' , 'tancada'];
  prioridad = ['baixa' , 'mitja' , 'alta' , 'crítica'];
  tecnicos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private incidenciaService: IncidenciaService,
    private usuarioService: UsuarioService
  ) {}

 ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;

    // 1. Cargar técnicos
    this.usuarioService.listarUsuarios().subscribe(usuarios => {
      this.tecnicos = usuarios.filter((u: any) => u.role === 'tecnic');  // filtramos técnicos

      // 2. Una vez tenemos técnicos, cargamos la incidencia
      this.incidenciaService.getIncidenciaById(this.id).subscribe(incidencia => {
        this.form = this.fb.group({
          titulo: [incidencia.titulo],
          descripcion: [incidencia.descripcion],
          prioridad: [incidencia.prioridad],
          estado: [incidencia.estado],
          tecnico: [incidencia.tecnico], 
        });
      });
    });
  }

  onSubmit() {
    if (this.form.valid) {
        console.log(this.form.value)
      this.incidenciaService.actualizarIncidencia(this.id, this.form.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: err => console.error('Error al editar incidencia:', err),
      });
    }
  }
  eliminarIncidencia() {
  if(confirm('¿Estás seguro que querés eliminar esta incidencia?')) {
    this.incidenciaService.eliminarIncidencia(this.id).subscribe({
      next: () => {
        alert('Incidencia eliminada');
      },
      error: (err) => {
        console.error(err);
        alert('Error al eliminar la incidencia');
      }
    });
  }
}
}