import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recuper-contrasena',
  templateUrl: './recuper-contrasena.component.html',
  styleUrls: ['./recuper-contrasena.component.sass']
})
export class RecuperContrasenaComponent {
  usernameControl = new FormControl('', [Validators.required]);

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  onSubmit() {
    if (this.usernameControl.valid) {
      // Asegúrate de que el valor no sea null antes de llamar al método del servicio
      const username = this.usernameControl.value ?? ''; // Usando el operador de coalescencia nula
      this.apiService.recuperarContrasena(username).subscribe({
        next: () => {
          this.toastr.success('Instrucciones de recuperación enviadas. Revisa tu correo electrónico.');
        },
        error: (error) => {
          console.error('Error al enviar el correo de recuperación:', error);
          this.toastr.error('Error al enviar el correo de recuperación.');
        }
      });
    } else {
      this.toastr.error('Por favor ingresa un nombre de usuario válido.');
    }
  }
}
