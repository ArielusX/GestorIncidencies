import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './nav.html',
  imports: [CommonModule],
  standalone: true,
})
export class NavbarComponent implements OnInit {
  usuario: Usuario | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUsuarioObservable().subscribe((usuario) => {
      this.usuario = usuario;
    });
  }

  inLog(): boolean {
    const enLogin = this.router.url.includes('/login');
    return !!this.usuario && !enLogin;
  }

  getInicial(): string {
    return this.usuario?.username?.charAt(0).toUpperCase() ?? '?';
  }

  irADashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
