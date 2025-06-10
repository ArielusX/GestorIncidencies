import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { UsuarioForm} from  './components/usuario-form/usuario-form';
import { UsuarioEditarComponent } from './components/usuario-edit/usuario-edit';
import { UsuarioList } from './components/usuario-list/usuario-list';
import { IncidenciaEdit } from './components/incidencia-edit/incidencia-edit';
import { IncidenciaForm } from './components/incidencia-form/incidencia-form';
import { IncidenciaDetallesComponent } from './components/incidencia-detalles/incidencia-detalles';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'usuarios/crear', component: UsuarioForm, canActivate: [AuthGuard, RoleGuard]},
  { path: 'usuarios/editar/:id', component: UsuarioEditarComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'usuarios/listar', component: UsuarioList, canActivate: [AuthGuard, RoleGuard] },
  { path: 'incidencias/editar/:id', component: IncidenciaEdit, canActivate: [AuthGuard, RoleGuard] },
  { path: 'incidencias/crear', component: IncidenciaForm , canActivate: [AuthGuard]},
  { path: 'incidencias/detalle/:id', component: IncidenciaDetallesComponent , canActivate: [AuthGuard]},
  { path: '**', redirectTo: '/' }

];

