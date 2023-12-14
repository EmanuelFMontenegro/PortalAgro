import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.sass']
})
export class InicioComponent implements OnInit {
  userEmail: string = ''; // Inicializa la variable para almacenar el email

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Obtiene el email del usuario cuando el componente se inicializa
    this.userEmail = this.authService.getUserEmail();
  }

  // ... Resto de tu código ...
}
