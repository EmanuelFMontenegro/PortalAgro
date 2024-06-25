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
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { PrimerRegistroComponent } from 'src/app/auth/primerRegistro/primerRegistro.component';
import { jwtDecode } from 'jwt-decode';

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
}

@Component({
  selector: 'app-login-backoffice',
  templateUrl: './login-backoffice.component.html',
  styleUrls: ['./login-backoffice.component.sass'],
})
export class LoginBackofficeComponent implements OnInit {
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
    private toastr: ToastrService
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

      this.apiService
        .validarCredencialBackoffice(username, password)
        .subscribe({
          next: (response) => {
            if (
              response.status === 200 &&
              response.body &&
              response.body.token
            ) {
              // Usuario autenticado correctamente
              localStorage.setItem('token', response.body.token);
              this.router.navigate(['/dashboard-backoffice']);
              this.mostrarMensajeExitoso();
              this.login.reset();
            } else {
              // Error de autenticación (usuario no registrado o contraseña incorrecta)
              this.toastr.error(
                'Contraseña incorrecta, intente de nuevo',
                'Atención'
              );
              this.mostrarMensajeError('Error de autenticación');
            }
          },
          error: (error) => {
            // Manejo de errores de la solicitud HTTP
            if (error.status === 401 && error.error.code === 4016) {
              this.toastr.warning('La contraseña ingresada es incorrecta.', 'Atención');
            } else {
              this.toastr.info('Usuario no registrado o desconocido.', 'Atención');
              console.error('Error durante la autenticación:', error);
            }
          },
        });

      this.toggleErrorCardClass(false);
    } else {
      this.toggleErrorCardClass(true); // Hay errores de validación en el formulario
      setTimeout(() => {
        this.adjustCardSize(true);
      }, 0);
    }
  }


  mostrarMensajeExitoso() {
    this.toastr.info('Portal AgroSustetable AgroTech.', 'Bienvenido', {
      timeOut: 500,
    });
  }
  adjustCardSize(hasError: boolean): void {
    const cardElement = document.querySelector('.login-card') as HTMLElement;

    if (cardElement) {
      if (!hasError) {
        // Restaura el tamaño original de la tarjeta si no hay errores
        cardElement.style.height = '500px';
      } else {
        // Establece la altura en 535px cuando hay errores
        cardElement.style.height = '535px';
      }
    }
  }
  toggleErrorCardClass(hasError: boolean): void {
    this.login.setErrors({ customError: hasError });
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
