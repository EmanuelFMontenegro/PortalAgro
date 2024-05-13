import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();

    if (token && !this.isTokenExpired(token)) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<any>(token);
      const now = Date.now().valueOf() / 1000;

      return decoded.exp < now;
    } catch (error) {
      return true;
    }
  }

  // Método para cerrar la sesión y eliminar el token
  logout(): void {
    this.authService.logout();
  }
}
