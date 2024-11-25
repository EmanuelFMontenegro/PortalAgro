import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { UserToken } from '../models/auth.models';
import { PermisoService } from './permisos.service';

interface DecodedToken {
  email: string;
  userId: number;
  field: string;
  exp: number; // Agrega el campo de expiración
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public admin = false;
  public productor = false;
  public userLogeed: UserToken | null = null;;
  private userEmail: string = '';
  private userId: number | null = null;
  private field: string | null = null; // Campo adicional obtenido del token
  private loginUrl = `${environment.apiUrl}/auth/login`; // URL de la API para el login
  public  userWithPermissions = new BehaviorSubject<UserToken | null>(null);

  constructor(private http: HttpClient,
    private permisoService: PermisoService) { }

  // Método para iniciar sesión
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { username, password }).pipe(
      map((response) => {
        const token = response?.token;
        if (token) {
          sessionStorage.setItem('token', token); // Cambiado a sessionStorage
          const decodedToken = jwtDecode<DecodedToken>(token); // Usa la interfaz DecodedToken
          this.userEmail = decodedToken.email;
          this.userId = decodedToken.userId;
          this.field = decodedToken.field;

          // Guardar el tiempo de expiración del token en sessionStorage
          const expirationTime = decodedToken.exp * 1000; // Expiration time in milliseconds
          sessionStorage.setItem('tokenExpiration', expirationTime.toString());

          return {
            email: decodedToken.email,
            id: decodedToken.userId,
            field: decodedToken.field,
          };
        } else {
          return null;
        }
      })
    );
  }

  /** Devuelve el usuario que está logueado actualmente en el sistema a travez del token */
  getUserLogeed(): UserToken | null {
    let token = sessionStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {
      // si falla la decodificación
      const decoded: any = jwtDecode(token);
      this.userLogeed = decoded;
      return this.userLogeed;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  async getUserWithPermisos() {
    let user: UserToken | null = this.getUserLogeed();

    // permisos
    let permisos = await this.permisoService.getPermisos()
    if(user) user.permisos = permisos

    this.userWithPermissions.next(user)
  }

  // Método para obtener el admin
  getAdmin(): boolean {
    return this.admin;
  }

  // Método para obtener el admin
  getProductor(): boolean {
    return this.productor;
  }
  // Método para obtener el email del usuario
  getUserEmail(): string {
    return this.userEmail;
  }

  // Método para obtener el ID del usuario
  getUserId(): number | null {
    return this.userId;
  }

  // Método para obtener el campo adicional
  getField(): string | null {
    return this.field;
  }

  // Método para obtener el token almacenado con verificación de expiración
  getToken(): string | null {
    const tokenExpiration = sessionStorage.getItem('tokenExpiration');
    if (tokenExpiration) {
      const currentTime = new Date().getTime();
      if (currentTime > parseInt(tokenExpiration, 10)) {
        // Token ha expirado
        this.logout();
        return null;
      }
    }
    return sessionStorage.getItem('token');
  }

  // Método para cerrar la sesión
  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tokenExpiration');
    this.userLogeed = null;
    this.userEmail = '';
    this.userId = null;
    this.field = null;
    this.admin = false;
    this.productor = false;
  }
}
