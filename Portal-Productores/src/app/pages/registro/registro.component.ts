import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/ApiService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.sass']
})
export class RegistrateComponent {
  hidePassword: boolean = true;
  registro: FormGroup;
  usernameControl: FormControl;
  passwordControl: FormControl;
  confirmPasswordControl: FormControl;
  cargandoValidacion: boolean = false;

  constructor(
    private toastr: ToastrService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.usernameControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.confirmPasswordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

    this.registro = new FormGroup({
      username: this.usernameControl,
      password: this.passwordControl,
      confirmPassword: this.confirmPasswordControl
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  enviarFormulario() {
    if (this.registro.valid) {
      const username = this.registro.get('username')?.value;
      const password = this.registro.get('password')?.value;

      console.log('Enviando formulario de registro con:', { username, password });

      this.apiService.registrarUsuario(username, password).subscribe({
        next: (response) => {
          // Procesamiento en caso de éxito
          this.cargandoValidacion = false;
          console.log('Registro exitoso:', response);
          this.toastr.success('Registro exitoso. Por favor, inicie sesión.', 'Éxito');
          this.irAInicioSesion();
        },
        error: (err) => {
          // Procesamiento en caso de error
          this.cargandoValidacion = false;
          console.log('Error en el registro:', err);
          this.manejarErrorRegistro(err);
        }
      });
    } else {
      console.log('Formulario de registro no válido:', this.registro.value);
    }
  }

  manejarErrorRegistro(err:any) {
    console.log('Manejando error de registro:', err);
    if (err.status === 400 && err.error?.message === 'User already exists.') {
      this.toastr.error('El usuario ya está registrado. Por favor, intente con otro username.', 'Usuario Existente');
    } else {
      this.toastr.error('Ocurrió un error durante el registro. Por favor, inténtelo de nuevo.', 'Error');
    }
  }

  irAInicioSesion(): void {
    this.router.navigate(['/login']);
  }
}
