import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  hidePassword: boolean = true;
  login: FormGroup;
  emailControl: FormControl;
  passwordControl: FormControl;
  cargandoValidacion: boolean = false;
  loginError: string | null = null;
  mostrarRegistro: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,

  ) {
    this.emailControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

    this.login = new FormGroup({
      email: this.emailControl,
      password: this.passwordControl
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  enviarFormulario() {
    if (this.login.valid) {
      this.cargandoValidacion = true;

      const email = this.login.get('email')?.value;
      const password = this.login.get('password')?.value;

      this.apiService.validarCredenciales(email, password).subscribe({
        next: (valido) => {
          this.cargandoValidacion = false;
          if (valido) {
            this.loginError = null;
            this.mostrarMensajeExitoso();
          } else {
            this.loginError = 'Credenciales inválidas';
            this.mostrarMensajeError();
          }
        },
        error: () => {
          this.cargandoValidacion = false;
          this.loginError = 'Error al validar credenciales';
          this.mostrarMensajeError();
        },
      });
    }
  }

  toggleMostrarRegistro(): void {
    console.log("Antes de mostrarRegistro:", this.mostrarRegistro);
    this.mostrarRegistro = !this.mostrarRegistro;

    if (this.mostrarRegistro) {
      console.log("Navegando a /registro");
      this.router.navigate(['/registro']);
    }
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }

  mostrarMensajeExitoso() {
    this.toastr.success('Acceso permitido.', 'Bienvenido', {
      timeOut: 2000,
    });
  }

  mostrarMensajeError() {
    this.toastr.error('Error de correo electrónico o contraseña / email no registrado.', 'Atencion', {
      timeOut: 2000,
    });
  }
}
