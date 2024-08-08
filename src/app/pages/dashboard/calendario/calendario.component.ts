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
        if (response && Array.isArray(response.list)) {
          this.events = response.list.map((event: any) => {
            let campoNombre = '';
            let tipoCultivo = '';
            let hectares = '';
            let lotes = '';

            if (event.description) {
              const descriptionParts = event.description.split('. ');
              campoNombre =
                descriptionParts
                  .find((part: string) => part.startsWith('Campo Nombre:'))
                  ?.replace('Campo Nombre:', '')
                  .trim() || '';
              tipoCultivo =
                descriptionParts
                  .find((part: string) => part.startsWith('Tipo de Cultivo:'))
                  ?.replace('Tipo de Cultivo:', '')
                  .trim() || '';
              hectares =
                descriptionParts
                  .find((part: string) =>
                    part.startsWith('Hectares del campo cargada:')
                  )
                  ?.replace('Hectares del campo cargada:', '')
                  .trim() || '';
              lotes =
                descriptionParts
                  .find((part: string) => part.startsWith('Lotes:'))
                  ?.replace('Lotes:', '')
                  .trim() || '';
            }

            return {
              id: event.id,
              title: event.title,
              start: moment(event.start).toISOString(),
              end: moment(event.end).toISOString(),
              extendedProps: {
                campoNombre,
                tipoCultivo,
                hectares,
                lotes,
              },
            };
          });
          console.log('Eventos mapeados:', this.events);
        } else {
          console.warn('La lista de eventos está vacía');
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
