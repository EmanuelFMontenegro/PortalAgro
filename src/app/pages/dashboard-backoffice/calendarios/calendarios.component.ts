import { Component, EventEmitter, Output } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';
import { EventInput } from '@fullcalendar/core';
import moment from 'moment';
import { ApiService } from 'src/app/services/ApiService'; 
@Component({
  selector: 'app-calendarios',
  templateUrl: './calendarios.component.html',
  styleUrls: ['./calendarios.component.sass']
})
export class CalendariosComponent {
  @Output() eventClick = new EventEmitter<any>();
  events: EventInput[] = [];
  constructor(private apiService: ApiService) {
  }

  async ngOnInit(){
    await this.ServiciosCalendario();
  }
  async ServiciosCalendario() {
    this.apiService.calendarBackoffice().subscribe(
      (response) => {
        if (response && Array.isArray(response.list)) {
          this.events = response.list.flat().map((event: any) => {
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
              start: moment(moment(event.dateEvent, "DD-MM-YYYY HH:mm:ss")
              .utcOffset('-03:00', true) 
              .toISOString(true))
              .toISOString(),  
              end: moment(moment(event.dateEvent, "DD-MM-YYYY HH:mm:ss").add(30, 'minutes')
              .utcOffset('-03:00', true) 
              .toISOString(true))
              .toISOString(),  
              extendedProps: {
                campoNombre,
                tipoCultivo,
                hectares,
                lotes,
              },
            };
          });
        } else {
          console.warn('La lista de eventos está vacía');
        }
      },
      (error) => {
        console.error('Error al obtener eventos del calendario:', error);
      }
    );
    console.log(this.events);
  }

  onDateClick(event: any): void {
    this.eventClick.emit(event);
  }

}