import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  rol: string = '';
  username: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuarioAutenticado();
    if (usuario) {
      this.rol = usuario.role;
      this.username = usuario.username;
    }
  }
}
