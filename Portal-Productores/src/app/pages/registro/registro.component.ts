import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiFakeService } from 'src/app/core/services/api-fake.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.sass']
})
export class RegistrateComponent {
  hidePassword: boolean = true;
  registro: FormGroup;
  emailControl: FormControl;
  passwordControl: FormControl;
  confirmPasswordControl: FormControl;
  cargandoValidacion: boolean = false;
  mostrarRegistro: boolean = false;

  constructor(
    private snackBar: MatSnackBar,
    private apiFakeService: ApiFakeService,
    private router: Router
  ) {
    this.emailControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.confirmPasswordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

    this.registro = new FormGroup({
      email: this.emailControl,
      password: this.passwordControl,
      confirmPassword: this.confirmPasswordControl
    });
  }

  toggleMostrarRegistro(): void {
    this.mostrarRegistro = !this.mostrarRegistro;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  enviarFormulario() {
    if (this.registro.valid) {
      this.cargandoValidacion = true;

      const email = this.registro.get('email')?.value;
      const password = this.registro.get('password')?.value;

      this.apiFakeService.registrarUsuario(email, password).subscribe((isRegistered) => {
        this.cargandoValidacion = false;

        if (isRegistered) {
          this.irAInicioSesion();
        } else {
          this.mostrarMensajeExitoso('Registro fallido. El usuario ya está registrado.');
        }
      });
    }
  }

  irAInicioSesion(): void {
    this.router.navigate(['/login']);
  }

  mostrarMensajeExitoso(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
