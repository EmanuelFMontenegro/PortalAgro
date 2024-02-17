import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userEmail: string = '';
  private userId: number | null = null;
  private field: string | null = null; // Campo adicional obtenido del token
  private loginUrl = 'http://localhost:8095/api/auth/login'; // URL de la API para el login

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { username, password }).pipe(
      map(response => {
        const token = response?.token;
        if (token) {
          localStorage.setItem('token', token); // Almacenar el token en localStorage

          // Decodificar el token y almacenar los datos
          const decodedToken = jwtDecode<{ email: string, userId: number, field: string }>(token);
          console.log('Decoded Token:', decodedToken);
          this.userEmail = decodedToken.email;
          console.log('Email del usuario:', this.userEmail); // Log del email
          this.userId = decodedToken.userId;
          console.log('ID del usuario:', this.userId); // Log del ID de usuario
          this.field = decodedToken.field; // Almacenar el campo adicional

          // Devolver los datos relevantes
          return { email: decodedToken.email, id: decodedToken.userId, field: decodedToken.field };
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

  // Método para obtener el token almacenado
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para cerrar la sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('campoSeleccionado');
    this.userEmail = '';
    this.userId = null;
    this.field = null;
  }

  clearToken(): void {
    localStorage.removeItem('token'); // O sessionStorage si prefieres
  }
}
