import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner'; // Importa NgxSpinnerService

@Component({
  selector: 'app-recuper-contrasena-admin',
  templateUrl: './recuper-contrasena-admin.component.html',
  styleUrls: ['./recuper-contrasena-admin.component.sass'],
})
export class RecuperContrasenaAdminComponent  {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  formulario: FormGroup;
  envioExitoso: boolean = false;
  loading: boolean = false; // Declarar la propiedad loading

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService // Inyecta NgxSpinnerService
  ) {
    this.formulario = this.formBuilder.group({
      email: [''],
    });
  }


  async onSubmit() {
    try {
      if (this.formulario.valid && !this.envioExitoso) {
        this.loading = true; // Activa el spinner al enviar la solicitud
        this.spinner.show(); // Mostrar el spinner

        const email = this.emailField?.value!;
        const response = await this.apiService
          .recuperarContrasena(email)
          .toPromise();

        if (response && response.code === 2007) {
          this.toastr.info(
            'Solicitud de recuperación de contraseña enviada con éxito. Revise su correo y siga las instrucciones'
          );
          this.formulario.reset();
          this.envioExitoso = true;
          this.router.navigate(['/login-admin'])
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
      this.loading = false; // Desactiva el spinner al finalizar la solicitud
      this.spinner.hide(); // Oculta el spinner
    }
  }

  get emailField() {
    return this.formulario.get('email');
  }

  irAInicioSesion(): void {
    this.router.navigate(['/login-admin']);
  }
}
