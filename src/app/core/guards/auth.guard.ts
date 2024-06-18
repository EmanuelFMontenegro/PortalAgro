import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from 'src/app/services/ApiService';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private apiService : ApiService) {}

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

  cargarPermisosUsuario(): void {
    this.apiService.getMyPermissions().subscribe(
      (permisos) => {
        // Guardar los permisos en un array
        const permisosArray: any[] = permisos; // Aquí define el tipo correcto de permisos si es conocido

        // Aquí puedes manejar la lógica de acuerdo a los permisos obtenidos
        // Por ejemplo, podrías asignar permisosArray a una propiedad de clase para utilizarlo en otros métodos
        console.log('Permisos del usuario:', permisosArray);

        // También puedes hacer cualquier otra lógica necesaria con los permisos
      },
      (error) => {
        console.error('Error al cargar permisos:', error);
      }
    );
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
