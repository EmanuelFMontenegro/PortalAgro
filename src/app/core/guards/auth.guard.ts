import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    // console.log("Token:", token);

    if (token && !this.isTokenExpired(token)) {
      console.log("Acceso permitido");
      return true;
    } else {
      console.log("Acceso denegado. Redirigiendo a login");
      this.router.navigate(['/login']);
      return false;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<any>(token);
      const now = Date.now().valueOf() / 1000;

      // Comprueba si el token ha expirado.
      if (decoded.exp < now) {
        return true;
      }

      return false;
    } catch (error) {
      return true; // Si hay un error en la decodificación, asume que el token es inválido
    }
  }
}
