import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.authService.getUserRole(); 
    if (userRole === 'admin') {
      return true;
    } else {
      this.router.navigate(['/dashboard']); 
      return false;
    }
  }
}
