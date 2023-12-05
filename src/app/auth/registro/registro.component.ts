import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/ApiService';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


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
  passwordVisible = false;

  constructor(
    private toastr: ToastrService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.usernameControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.confirmPasswordControl = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.confirmPasswordValidator.bind(this)
    ]);

    this.registro = new FormGroup({
      username: this.usernameControl,
      password: this.passwordControl,
      confirmPassword: this.confirmPasswordControl
    });

    this.registro.valueChanges.subscribe(() => {
      this.updateButtonValidity();
    });
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    let passwordInput = document.getElementById('password') as HTMLInputElement;
    let confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
    passwordInput.type = confirmPasswordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  enviarFormulario() {
    if (this.registro.valid) {
      const username = this.registro.get('username')?.value;
      const password = this.registro.get('password')?.value;

      console.log('Enviando formulario de registro con:', { username, password });

      this.cargandoValidacion = true;

      this.apiService.registrarUsuario(username, password).subscribe({
        next: (response) => {

          this.cargandoValidacion = false;
          console.log('Registro exitoso:', response);
          this.toastr.info('Registro exitoso. Por favor, inicie sesión.', 'Éxito');
          this.irAInicioSesion();
        },
        error: (err) => {

          this.cargandoValidacion = false;
          this.manejarErrorRegistro(err);
        }
      });
    } else {
      console.log('Formulario de registro no válido:', this.registro.value);
    }
  }

  manejarErrorRegistro(err: any) {
    console.log('Error:', err);

     if (err.status === 400 && err.error?.message === 'User already exists.') {
        this.toastr.error('El usuario ya está registrado. Por favor, intente con otro email.', 'Usuario Existente');
    } else if (err.status === 0) {
        this.toastr.error('Ocurrió un error de conexión. Por favor, inténtelo de nuevo más tarde.', 'Error de Conexión');
    } else {

        this.toastr.error('Ocurrió un error desconocido. Por favor, inténtelo de nuevo.', 'Error');
    }
}

irAInicioSesion(): void {
    this.router.navigate(['/login']);
  }

  confirmPasswordValidator(control: AbstractControl): { [key: string]: any } | null {
    if (this.passwordControl && control.value !== this.passwordControl.value) {
           return { 'passwordsNotMatch': true };
    }
    return null;
  }

  updateButtonValidity() {
    const isPasswordMatchError = this.confirmPasswordControl.errors?.['passwordsNotMatch'];
    const isFormValid = this.registro.valid && !isPasswordMatchError;
    const button = document.getElementById('submitBtn') as HTMLButtonElement;

    if (button) {
      button.disabled = !isFormValid;
    }
  }

}
