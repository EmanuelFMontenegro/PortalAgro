import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  iniciarSesion() {
    if (this.loginForm.valid) {
      // Implementar lógica de inicio de sesión aquí
      console.log('Formulario de inicio de sesión válido', this.loginForm.value);
    }
  }
}
