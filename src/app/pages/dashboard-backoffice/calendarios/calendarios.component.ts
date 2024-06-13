import { Component } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';

@Component({
  selector: 'app-calendarios',
  templateUrl: './calendarios.component.html',
  styleUrls: ['./calendarios.component.sass']
})
export class CalendariosComponent {

  constructor(public dashboardBackOffice: DashboardBackOfficeService)
    {
     this.dashboardBackOffice.dataTitulo.next({ titulo: `Calendario` , subTitulo: ''})
    }

}
