import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
// Importa NgxSpinnerService

@Component({
  selector: 'app-recuper-contrasena-backoffice',
  templateUrl: './recuper-contrasena-backoffice.component.html',
  styleUrls: ['./recuper-contrasena-backoffice.component.sass'],
})
export class RecuperContrasenaBackofficeComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  formulario: FormGroup;
  cargandoValidacion: boolean = false;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router // Inyecta NgxSpinnerService
  ) {
    this.formulario = this.formBuilder.group({
      email: [''],
    });
  }

  async onSubmit() {
    try {
      if (this.formulario.valid) {
        this.cargandoValidacion = true; // Activa el spinner al enviar la solicitud
        // Mostrar el spinner

        const email = this.emailField?.value!;
        const response = await this.apiService
          .recuperarContrasena(email)
          .toPromise();

        if (response && response.code === 2007) {
          this.toastr.info(
            'Solicitud de recuperación de contraseña enviada con éxito. Revise su correo y siga las instrucciones'
          );
          this.formulario.reset();

          this.router.navigate(['/login-backoffice']);
        } else {
          this.toastr.warning(
            'Respuesta inesperada del servidor. Por favor, inténtalo de nuevo más tarde.',
            'Error'
          );
        }
      }
    } catch (error) {
      this.toastr.error(
        'Ocurrió un error al enviar la solicitud de recuperación de contraseña. Por favor, inténtalo de nuevo más tarde.',
        'Error'
      );
      console.error('Error al enviar el correo de recuperación:', error);
    } finally {
      this.cargandoValidacion = false; // Desactiva el spinner al finalizar la solicitud
      // Oculta el spinner
    }
  }

  get emailField() {
    return this.formulario.get('email');
  }

  irAInicioSesion(): void {
    this.router.navigate(['/login-backoffice']);
  }
}
