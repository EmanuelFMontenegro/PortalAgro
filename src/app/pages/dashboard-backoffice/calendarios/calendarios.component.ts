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
    this.events = INITIAL_EVENTS;
  }

}