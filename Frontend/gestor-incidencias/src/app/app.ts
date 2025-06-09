import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, RouterModule],
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.css'],
})
export class App {
  protected title = 'gestor-incidencias';

}
