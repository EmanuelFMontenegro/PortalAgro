import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DashboardBackOfficeService } from '../../dashboard-backoffice/dashboard-backoffice.service';
import { ApiService } from 'src/app/services/ApiService';
import moment from 'moment';
import { EventInput } from '@fullcalendar/core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.sass'],
})
export class CalendarioComponent implements OnInit {
  @Output() eventClick = new EventEmitter<any>();
  events: EventInput[] = [];

  constructor(
    private dashboardBackOffice: DashboardBackOfficeService,
    private apiService: ApiService
  ) {
    this.dashboardBackOffice.dataTitulo.next({
      titulo: `¡Bienvenido!, Acá podrás ver tu calendario de trabajo`,
      subTitulo: '',
    });
  }

  ngOnInit(): void {
    this.ServiciosCalendario();
  }

  ServiciosCalendario(): void {
    this.apiService.calendarProducer().subscribe(
      (response) => {
        console.log('Respuesta del endpoint:', response);
        if (response && response.list && response.list.length > 0) {
          this.events = response.list[0].map((event: any) => {
            // Extract additional details from description
            const descriptionParts = event.description.split('. ');
            const campoNombre = descriptionParts.find((part: string) => part.startsWith('Campo Nombre:'))?.replace('Campo Nombre:', '').trim();
            const tipoCultivo = descriptionParts.find((part: string) => part.startsWith('Tipo de Cultivo:'))?.replace('Tipo de Cultivo:', '').trim();
            const hectares = descriptionParts.find((part: string) => part.startsWith('Hectares del campo cargada:'))?.replace('Hectares del campo cargada:', '').trim();
            const lotes = descriptionParts.find((part: string) => part.startsWith('Lotes:'))?.replace('Lotes:', '').trim();

            return {
              id: event.id,
              title: event.title,
              start: moment(event.dateEvent, 'DD/MM/YYYY HH:mm').toISOString(),
              end: moment(event.dateEvent, 'DD/MM/YYYY HH:mm')
                .add(1, 'hours')
                .toISOString(),
              extendedProps: {
                campoNombre,
                tipoCultivo,
                hectares,
                lotes
              }
            };
          });
          console.log('Eventos mapeados:', this.events);
        } else {
          console.warn('La respuesta no contiene eventos válidos');
        }
      },
      (error) => {
        console.error('Error al obtener eventos del calendario:', error);
      }
    );
  }


  onDateClick(event: any): void {
    this.eventClick.emit(event);
  }
}
