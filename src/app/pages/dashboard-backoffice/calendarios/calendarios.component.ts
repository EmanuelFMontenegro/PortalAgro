import { Component } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';
import { INITIAL_EVENTS } from './event-utils';

@Component({
  selector: 'app-calendarios',
  templateUrl: './calendarios.component.html',
  styleUrls: ['./calendarios.component.sass']
})
export class CalendariosComponent {
  events: any[] = [];
  constructor(private dashboardBackOffice: DashboardBackOfficeService) {
    this.events = INITIAL_EVENTS; // aca consumiria la data de la api para mostrar los eventos en el calendario
    this.dashboardBackOffice.dataTitulo.next({ titulo: `¡Bienvenido!, Acá podrás ver tu calendario de trabajo` , subTitulo: ''});
     
  }

}