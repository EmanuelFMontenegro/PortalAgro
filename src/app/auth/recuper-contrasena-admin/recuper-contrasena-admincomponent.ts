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

@Component({
  selector: 'app-recuper-contrasena-admin',
  templateUrl: './recuper-contrasena-admin.component.html',
  styleUrls: ['./recuper-contrasena-admin.component.sass'],
})
export class RecuperContrasenaAdminComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  formulario: FormGroup;
  envioExitoso: boolean = false;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.formulario = this.formBuilder.group({
      email: [''],
    });
  }

  get emailField() {
    return this.formulario.get('email');
  }

  onSubmit() {
    if (this.emailField?.valid && !this.envioExitoso) {
      const email = this.emailField?.value!;

      this.apiService.recuperarContrasena(email).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.toastr.info(
              'Correo con instrucciones de recuperación enviado con éxito. Revisa tu correo electrónico para continuar.'
            );
            this.formulario.reset();
            console.log('Formulario reseteado');
            this.envioExitoso = true;
          } else {
            this.toastr.warning('Respuesta inesperada del servidor.');
          }
        },
        error: (error) => {
          this.toastr.error(
            'El correo electrónico ingresado no se encuentra registrado.',
            'Atencion'
          );
          console.error('Error al enviar el correo de recuperación:', error);
        },
      });
    } else if (this.envioExitoso) {
      this.toastr.info('Correo ya enviado con éxito. Por favor, espere.');
    } else {
      this.toastr.error('Por favor ingresa un correo electrónico válido.');
    }
  }

  irAInicioSesion(): void {
    this.router.navigate(['/login-admin']);
  }
}
