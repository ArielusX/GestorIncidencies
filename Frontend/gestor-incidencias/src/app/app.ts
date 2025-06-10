import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/nav/nav';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, RouterModule, NavbarComponent],
  template: '  <app-navbar></app-navbar><router-outlet></router-outlet>',
  styleUrls: ['./app.css'],
})
export class App {
  protected title = 'gestor-incidencias';


}
