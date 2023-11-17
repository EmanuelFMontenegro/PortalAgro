import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiFakeService {
  private usuariosRegistrados: { email: string; password: string }[] = [
    { email: 'emanuel_efm@hotmail.com', password: '12345678' },
    { email: 'prueba@hotmail.com', password: '12345678' }, // Usuario de prueba
    // Agrega más usuarios si es necesario
  ];

  constructor() {}

  validarCredenciales(email: string, password: string): Observable<boolean> {
    const usuarioRegistrado = this.usuariosRegistrados.find(
      (user) => user.email === email && user.password === password
    );

    // Verificar si el usuario está registrado antes de permitir el inicio de sesión
    if (!usuarioRegistrado) {
      return of(false); // Usuario no registrado, no puede iniciar sesión
    }

    return of(true); // Usuario registrado, puede iniciar sesión
  }

  registrarUsuario(email: string, password: string): Observable<boolean> {
    const usuarioExistente = this.usuariosRegistrados.find(
      (user) => user.email === email
    );

    if (usuarioExistente) {
      return of(false); // El usuario ya está registrado
    }

    this.usuariosRegistrados.push({ email, password });
    return of(true); // Registro exitoso
  }
}
