import { Injectable } from '@angular/core';
import { ApiService } from './ApiService';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userEmail: string = ''; // Inicializa como una cadena vacía

  constructor(private apiService: ApiService) {}

  // Método para validar credenciales y obtener el email del usuario
  validarCredenciales(username: string, password: string) {
    this.apiService.validarCredenciales(username, password).subscribe(response => {
      console.log('Respuesta completa del servidor:', response); // Ver la respuesta completa

      if (response.status === 200) {
        console.log('Cuerpo de la respuesta:', response.body); // Inspeccionar el cuerpo de la respuesta
        if (response.body && response.body.email) {
          this.userEmail = response.body.email;
          console.log('Email obtenido:', this.userEmail);
        } else {
          console.error('Email no presente en la respuesta');
        }
      }
    }, error => {
      console.error('Error en la solicitud:', error);
    });
  }



  getUserEmail(): string {
    console.log('Email solicitado desde el servicio:', this.userEmail); // Log cada vez que se accede al email
    return this.userEmail;
  }

  // ... otros métodos relacionados con la autenticación ...
}
