import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';

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
      const username = this.login.get('username')?.value;
      const password = this.login.get('password')?.value;

      this.apiService.validarCredenciales(username, password).subscribe({
        next: (response) => {
          // Código existente para manejar una respuesta exitosa
          if (response.status === 200 && response.body && response.body.token) {
            localStorage.setItem('token', response.body.token);
            this.mostrarMensajeExitoso();
            this.login.reset();
            this.router.navigate(['/dashboard']);
          } else {
            // Si el estado no es 200 o no hay token, considerar esto como un error de autenticación
            this.mostrarMensajeError('Error de autenticación');
          }
        },
        error: (err) => {
          // Verificación adicional para errores de red o servidor inactivo
          if (err.status === 0) {
            this.toastr.error('No se puede conectar al servidor. Por favor verifica tu conexión a internet.', 'Error de Conexión');
          } else if (err.error.message === 'Username does not exist.') {
            this.toastr.info('El usuario no está registrado. Por favor regístrese', 'Atención');
            this.login.reset();
          } else if (err.error.message === 'El usuario debe validar su email') {
            this.toastr.warning('Por favor revisa tu casilla de E-mail.', 'Advertencia');
          } else {
            this.toastr.error('La contraseña ingresada es incorrecta.', 'Error');
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
