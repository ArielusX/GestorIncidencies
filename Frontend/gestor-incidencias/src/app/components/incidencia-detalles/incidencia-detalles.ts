import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Incidencia } from '../../models/incidencia.model';
import { IncidenciaService } from '../../services/incidencia.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  standalone: true,
  selector: 'app-incidencia-detalles',
  imports: [CommonModule, RouterModule],
  templateUrl: './incidencia-detalles.html',
})
export class IncidenciaDetallesComponent implements OnInit {
  incidencia!: Incidencia;
  tecnicos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidenciaService: IncidenciaService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.usuarioService.listarUsuarios().subscribe(usuarios => {
        this.tecnicos = usuarios.filter((u: any) => u.role === 'tecnic');
      });

      this.incidenciaService.getIncidenciaById(id).subscribe(inc => {
        this.incidencia = inc;
      });
    }
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}
