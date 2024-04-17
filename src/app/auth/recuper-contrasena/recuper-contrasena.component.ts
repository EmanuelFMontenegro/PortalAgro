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
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-recuper-contrasena',
  templateUrl: './recuper-contrasena.component.html',
  styleUrls: ['./recuper-contrasena.component.sass'],
})
export class RecuperContrasenaComponent {
  hasErrors: boolean = false;
  emailControl = new UntypedFormControl('', [
    Validators.required,
    Validators.email,
  ]);
  recuperContra: FormGroup;
  usernameControl: FormControl;
  cargandoValidacion: boolean = false;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    Validators.required,
      Validators.email,
      (this.usernameControl = new FormControl('', [
        Validators.required,
        Validators.email,
      ]));
    this.recuperContra = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get emailField() {
    return this.recuperContra.get('email');
  }

  adjustCardSize(hasError: boolean): void {
    const cardElement = document.querySelector('.recuper-card') as HTMLElement;

    if (cardElement) {
      if (!hasError) {
        cardElement.style.height = '500px';
      } else {
        cardElement.style.height = '535px';
      }
    }
  }

  async onSubmit() {
    try {
      if (this.recuperContra.valid) {
        this.cargandoValidacion = true; // Activa el spinner
        const email = this.emailField?.value!;
        const response = await this.apiService
          .recuperarContrasena(email)
          .toPromise();

        if (response && response.code === 2007) {
          this.toastr.info(
            'Solicitud de recuperación de contraseña enviada con éxito. Revise su correo y siga las instrucciones'
          );
          // this.activarSpinner = true;
          this.recuperContra.reset();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
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
      this.cargandoValidacion = false; // Desactiva el spinner
    }
  }

  irAInicioSesion(): void {
    this.router.navigate(['/login']);
  }
}
