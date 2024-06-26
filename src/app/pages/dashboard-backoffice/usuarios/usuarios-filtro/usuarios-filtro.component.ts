import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardBackOfficeService } from '../../dashboard-backoffice.service';

@Component({
  selector: 'app-usuarios-filtro',
  templateUrl: './usuarios-filtro.component.html',
  styleUrls: ['./usuarios-filtro.component.sass']
})
export class UsuariosFiltroComponent {
  titulo: string = 'Usuarios';
  userFilterOptions = [
    { value: 'gerenteGeneral', label: 'Gerente General' },
    { value: 'tecnicoGeneral', label: 'Técnico General' },
    { value: 'tecnico', label: 'Técnico' },
    { value: 'piloto', label: 'Piloto' },
    { value: 'cooperativa', label: 'Cooperativa' }
  ];

  constructor(
    private router: Router,
    public dashboardBackOffice: DashboardBackOfficeService // Asegúrate de usar el nombre correcto
  ) {
    this.dashboardBackOffice.dataTitulo.next({
      titulo: '¡Bienvenido!, Acá podrás gestionar, los usuarios del Sistema',
      subTitulo: ''
    });
  }

  aplicarFiltro(filtroSeleccionado: string) {
    console.log('Filtro seleccionado:', filtroSeleccionado);
    // Lógica para aplicar el filtro basado en el valor seleccionado
  }

  BtnCrearUsuarios() {
    this.router.navigate(['dashboard-backoffice/usuarios']);
  }
}
