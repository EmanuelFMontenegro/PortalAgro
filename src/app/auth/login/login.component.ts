import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { ThemeService } from 'src/app/services/theme.service';

export function usernameValidator(
  control: FormControl
): { [key: string]: any } | null {
  const validUsername = /^[a-zA-Z0-9_]+$/;
  if (control.value && !validUsername.test(control.value)) {
    return { invalidUsername: true };
  }
  return null;
}
interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
  exp: number;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  hasErrors: boolean = false;
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
    private toastr: ToastrService,
    private themeService: ThemeService
  ) {
    Validators.required,
      Validators.email,
      (this.usernameControl = new FormControl('', [
        Validators.required,
        Validators.email,
      ]));
    this.passwordControl = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]);
    this.login = new FormGroup({
      username: this.usernameControl,
      password: this.passwordControl,
    });
    this.confirmPasswordControl = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.confirmPasswordValidator.bind(this),
    ]);
  }

  ngOnInit(): void {
    this.adjustCardSize(false);
    this.themeService.setTheme('dashboard');
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    let passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  adjustCardSize(hasError: boolean): void {
    const cardElement = document.querySelector('.login-card') as HTMLElement;

    if (cardElement) {
      if (!hasError) {
        cardElement.style.height = '500px';
      } else {
        cardElement.style.height = '535px';
      }
    }
  }
  loginUser() {
    if (this.login.valid) {
      const username = this.login.get('username')?.value;
      const password = this.login.get('password')?.value;

      this.apiService.validarCredenciales(username, password).subscribe({
        next: (response) => {
          if (response.status === 200 && response.body && response.body.token) {
            const token = response.body.token;
            const decoded: DecodedToken = jwtDecode(token);

            // Calcular la hora de expiración del token y guardarla en sessionStorage
            const expirationTime = decoded.exp * 1000; // Expiration time in milliseconds
            sessionStorage.setItem('token', token);
            sessionStorage.setItem(
              'tokenExpiration',
              expirationTime.toString()
            ); // Save expiration time

            const userId = decoded.userId;
            const personId = userId;
            console.log('datos del userId', userId);
            console.log('person id', personId);
            this.apiService.getPersonByIdProductor(userId, personId).subscribe(
              (userData) => {
                if (userData && userData.name) {
                  this.router.navigate(['/dashboard']);
                } else {
                  this.router.navigate(['/primerRegistro']);
                }
              },
              (userError) => {
                console.error('Error al obtener datos del usuario:', userError);
              }
            );

            this.mostrarMensajeExitoso();
            this.login.reset();
          } else {
            this.hasErrors = true;
            this.mostrarMensajeError('Error de autenticación');
          }
        },
        error: (err) => {
          if (err.status === 0) {
            this.toastr.error(
              'No se puede conectar al servidor. Por favor verifica tu conexión a internet.',
              'Error de Conexión'
            );
          } else if (err.status === 404) {
            this.toastr.info(
              'El usuario no está registrado. Por favor regístrese',
              'Atención'
            );
            this.login.reset();
          } else if (err.status === 403) {
            this.toastr.info(
              'Este usuario no está registrado. Por favor, regístrese para iniciar sesión.',
              'Atención'
            );
            this.login.reset();
          } else if (err.status === 401 && err.error.code === 4011) {
            const errorMessage = err.error.message || 'Error de autenticación';
            const details =
              err.error.details || 'Detalles del error no disponibles';

            if (details.includes('Email not found')) {
              this.toastr.info(
                'El usuario no está registrado. Por favor regístrese',
                'Atención'
              );
              this.login.reset();
            } else {
              this.toastr.error(errorMessage, 'Error');
            }
          } else if (err.status === 400 && err.error.code === 4016) {
            this.toastr.error(
              'Error de contraseña. Por favor intenta de nuevo.',
              'Atención'
            );
          } else if (err.status === 401 && err.error.code === 4001) {
            this.toastr.warning(
              'Por favor revisa tu casilla de correo electrónico para activar tu cuenta.',
              'Atención',
              { closeButton: true }
            );
          } else {
            const errorMessage = err.error.message || 'Error desconocido';
            this.toastr.error(errorMessage, 'Error');
          }

          this.hasErrors = true;
        },
      });
    }
  }

  toggleErrorCardClass(hasError: boolean): void {
    this.login.setErrors({ customError: hasError });
  }

  mostrarMensajeExitoso() {
    this.toastr.info('Acceso permitido.', 'Bienvenido', { timeOut: 500 });
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

  confirmPasswordValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (this.passwordControl && control.value !== this.passwordControl.value) {
      return { passwordsNotMatch: true };
    }
    return null;
  }

  updateButtonValidity() {
    const isPasswordMatchError =
      this.confirmPasswordControl.errors?.['passwordsNotMatch'];
    const isFormValid = this.login.valid && !isPasswordMatchError;
    const button = document.getElementById('submitBtn') as HTMLButtonElement;
    if (button) {
      button.disabled = !isFormValid;
    }
  }
}
