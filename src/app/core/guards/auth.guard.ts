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
    const isBackoffice = this.isBackofficeUrl();

    if (token && !this.isTokenExpired(token)) {
      return true;
    } else {
      if (isBackoffice) {
        this.router.navigate(['/login-backoffice']);
      } else {
        this.router.navigate(['/login']);
      }
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

  private isBackofficeUrl(): boolean {
    // Obtener la URL actual del navegador
    const currentUrl = window.location.pathname;

    // Lista de identificadores que podrían indicar una URL del backoffice
    const backofficeIdentifiers = ['/backoffice', '/admin'];

    // Verificar si la URL contiene alguno de los identificadores de backoffice
    return backofficeIdentifiers.some(identifier => currentUrl.includes(identifier));
  }

  // Método para cerrar la sesión y eliminar el token
  logout(): void {
    this.authService.logout();
  }
}
