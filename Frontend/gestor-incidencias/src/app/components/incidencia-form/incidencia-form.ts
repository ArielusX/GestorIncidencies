import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IncidenciaService } from '../../services/incidencia.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-incidencia-form',
  templateUrl: './incidencia-form.html',
  styleUrl: './incidencia-form.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class IncidenciaForm {
  form: FormGroup;

  prioridad = ['baixa', 'mitja', 'alta', 'crítica'];

  constructor(
    private fb: FormBuilder,
    private incidenciaService: IncidenciaService,
    private router: Router,
    private authService: AuthService,
  ) {
    const usuario = this.authService.obtenerUsuarioAutenticado();
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      estado: ['oberta', Validators.required],
      usuarioCreador: [usuario?.username || '', Validators.required],
      prioridad: [''],
      tecnico: [''],
    });
  }
       

  onSubmit() {
    if (this.form.valid) {
      this.incidenciaService.crearIncidencia(this.form.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => console.error('Error al crear incidencia:', err),
      });
    }
  }
}
