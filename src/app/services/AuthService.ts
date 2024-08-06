import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

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
  private userEmail: string = '';
  private userId: number | null = null;
  private field: string | null = null; // Campo adicional obtenido del token
  private loginUrl = `${environment.apiUrl}/auth/login`; // URL de la API para el login

  constructor(private http: HttpClient) {}

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
    this.userEmail = '';
    this.userId = null;
    this.field = null;
  }
}
