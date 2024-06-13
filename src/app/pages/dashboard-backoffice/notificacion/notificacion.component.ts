import { Component } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.sass']
})
export class NotificacionComponent {

  constructor(public dashboardBackOffice: DashboardBackOfficeService)
  {
   this.dashboardBackOffice.dataTitulo.next({ titulo: `Notificaciones` , subTitulo: ''})
  }


}
