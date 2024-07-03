import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/services/AuthService';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.authService.getToken();

    if (token && !this.isTokenExpired(token)) {
      const decodedToken: any = jwtDecode(token);
      const roles = decodedToken.roles.map((role: any) => role.authority); // Obtener los roles del usuario

      const isAdmin = roles.includes('ROLE_ADMIN');
      const isUsuariosRoute = state.url.includes(
        '/dashboard-backoffice/usuarios'
      );

      if (!isAdmin && isUsuariosRoute) {
        console.log(
          'Acceso denegado a usuarios para usuarios no administradores.'
        );
        this.toastr.warning(
          'No tienes permisos para acceder a esta sección.',
          'Acceso Restringido'
        );
        this.router.navigate(['/dashboard-backoffice']);
        return false;
      }

      return true; // Permitir acceso si cumple con las condiciones
    } else {
      console.log('Token inválido o expirado, redirigiendo al login.');
      this.router.navigate(['/dashboard-backoffice/login']);
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
}
