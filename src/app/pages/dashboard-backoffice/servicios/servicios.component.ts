import { Component } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.sass']
})
export class ServiciosComponent {

  constructor(public dashboardBackOffice: DashboardBackOfficeService)
    {
     this.dashboardBackOffice.dataTitulo.next({ titulo: `Solicitudes y Servicios` , subTitulo: ''})
    }

}
