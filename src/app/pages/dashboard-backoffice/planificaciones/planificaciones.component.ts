import { Component } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';

@Component({
  selector: 'app-planificaciones',
  templateUrl: './planificaciones.component.html',
  styleUrls: ['./planificaciones.component.sass']
})
export class PlanificacionesComponent {
  constructor( public dashboardBackOffice: DashboardBackOfficeService)
  {
    this.dashboardBackOffice.dataTitulo.next({ titulo: `Planificaciones` , subTitulo: ''})
  }
}
