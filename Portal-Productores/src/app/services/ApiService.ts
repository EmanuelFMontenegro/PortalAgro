import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = 'http://localhost:8095/api';

  constructor(private http: HttpClient) { }

  // Método para validar credenciales de usuario
  validarCredenciales(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/login`, { username: email, password: password });
  }

  // Método para registrar un nuevo usuario
  registrarUsuario(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/register`, { username, password }, { responseType: 'text' });
  }


  // Método para la recuperación de contraseña
  recuperarContrasena(email: string): Observable<any> {
    return this.http.post(`${this.baseURL}/email/recovery`, { mailTo: email });
  }

  // Método para cambiar la contraseña (si tienes un endpoint específico para esto)
  cambiarContrasena(password: string, confirmPassword: string, token: string): Observable<any> {
    return this.http.post(`${this.baseURL}/email/change-pass`, { password, confirmPassword, token });
  }
}
