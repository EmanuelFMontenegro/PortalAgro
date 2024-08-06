import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { setupUnloadListener } from './upload-handler-app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  ngOnInit() {}

  iniciarSesion() {
    if (this.loginForm.valid) {
      // Implementar lógica de inicio de sesión aquí
      console.log('Inicio de Sesión Correcto !!!', this.loginForm.value);
    }
  }
}
