import { Component } from '@angular/core';
import { INITIAL_EVENTS } from '../../dashboard-backoffice/calendarios/event-utils';
import { DashboardBackOfficeService } from '../../dashboard-backoffice/dashboard-backoffice.service';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.sass']
})
export class CalendarioComponent {
  
  events: any[] = [];
  constructor(private dashboardBackOffice: DashboardBackOfficeService) {
    this.events = INITIAL_EVENTS; // aca consumiria la data de la api para mostrar los eventos en el calendario
    this.dashboardBackOffice.dataTitulo.next({ titulo: `¡Bienvenido!, Acá podrás ver tu calendario de trabajo` , subTitulo: ''});
     
  }

}
