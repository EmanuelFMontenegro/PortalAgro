import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';

export function usernameValidator(control: FormControl): { [key: string]: any } | null {
  const validUsername = /^[a-zA-Z0-9_]+$/;
  if (control.value && !validUsername.test(control.value)) {
    return { invalidUsername: true };
  }
  return null;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  hidePassword: boolean = true;
  login: FormGroup;
  usernameControl: FormControl;
  passwordControl: FormControl;
  cargandoValidacion: boolean = false;
  loginError: string | null = null;
  mostrarRegistro: boolean = false;
  emailControl = new FormControl('');
  passwordVisible = false;
  confirmPasswordControl: FormControl;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {
    Validators.required,
    Validators.email,
    this.usernameControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.login = new FormGroup({
      username: this.usernameControl,
      password: this.passwordControl
    });
    this.confirmPasswordControl = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.confirmPasswordValidator.bind(this)
    ]);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    let passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  enviarFormulario() {
    if (this.login.valid) {
      // localStorage.removeItem('token');
      const username = this.login.get('username')?.value;
      const password = this.login.get('password')?.value;

      this.apiService.validarCredenciales(username, password).subscribe({
        next: (response) => {

          if (response.status === 200 && response.body && response.body.token) {
            localStorage.setItem('token', response.body.token);
            this.mostrarMensajeExitoso();
            this.login.reset();
            this.router.navigate(['/dashboard']);
          } else {

            this.mostrarMensajeError('Error de autenticación');
          }
        },
        error: (err) => {
          if (err.status === 0) {
            this.toastr.error('No se puede conectar al servidor. Por favor verifica tu conexión a internet.', 'Error de Conexión');
          } else if (err.status === 404) {
            this.toastr.info('El usuario no está registrado. Por favor regístrese', 'Atención');
            this.login.reset();
          } else if (err.status === 401 && err.error.code === 4011) {
            const errorMessage = err.error.message || 'Error de autenticación';
            const details = err.error.details || 'Detalles del error no disponibles';

            if (details.includes('Email not found')) {
              this.toastr.info('El usuario no está registrado. Por favor regístrese', 'Atención');
              this.login.reset();
            } else {

              this.toastr.error(errorMessage, 'Error');
            }
          } else if (err.status === 400 && err.error.code === 4016) {
            this.toastr.error('Error de contraseña. Por favor intenta de nuevo.','Atencion');
          } else if (err.status === 401 && err.error.code === 4001) {
            this.toastr.warning('Por favor revisa tu casilla de correo electrónico para activar tu cuenta.', 'Advertencia', { closeButton: true });
          } else {
            const errorMessage = err.error.message || 'Error desconocido';
            this.toastr.error(errorMessage, 'Error');
          }
        }

      });
    } else {
      console.log('Formulario de inicio de sesión no válido:', this.login.value);
    }
  }

  mostrarMensajeExitoso() {
    this.toastr.info('Acceso permitido.', 'Bienvenido', { timeOut: 1000 });

  }

  mostrarMensajeError(mensaje: string) {
    this.toastr.error(mensaje, 'Error', { timeOut: 1000 });
  }

  toggleMostrarRegistro(): void {
    this.mostrarRegistro = !this.mostrarRegistro;
    if (this.mostrarRegistro) {
      this.router.navigate(['/registro']);
    }
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }

  confirmPasswordValidator(control: AbstractControl): { [key: string]: any } | null {
    if (this.passwordControl && control.value !== this.passwordControl.value) {
           return { 'passwordsNotMatch': true };
    }
    return null;
  }

  updateButtonValidity() {

    const isPasswordMatchError = this.confirmPasswordControl.errors?.['passwordsNotMatch'];
    const isFormValid = this.login.valid && !isPasswordMatchError;
    const button = document.getElementById('submitBtn') as HTMLButtonElement;
    if (button) {
      button.disabled = !isFormValid;
    }
  }

}
