import {
  Component,
  Input,
  OnInit,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { CalendarOptions, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { MatDialog } from '@angular/material/dialog';
import { CalendarPopupComponent } from 'src/app/shared/components/calendar-popup/calendar-popup.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.sass'],
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() events!: EventInput[];
  calendarOptions: CalendarOptions;
  currentEvents: EventApi[] = [];

  constructor(public dialogRef: MatDialog) {
    this.calendarOptions = {
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
      initialView: 'dayGridMonth',
      weekends: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      locale: esLocale,
      longPressDelay: 1,
      eventClick: this.handleEventClick.bind(this),
      events: this.events, // Asigna los eventos aquí
    };

    this.setupCalendarOptions(window.innerWidth);
  }

  ngOnInit() {
    // La asignación de eventos se realizará en ngOnChanges
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['events'] && changes['events'].currentValue) {
      console.log(
        'Eventos recibidos en CalendarComponent:',
        changes['events'].currentValue
      );
      this.calendarOptions.events = changes['events'].currentValue;
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log('Evento clicado:', clickInfo.event);
    this.dialogRef.open(CalendarPopupComponent, {
      data: {
        event: clickInfo.event,
      },
    });
  }

  setupCalendarOptions(width: number) {
    const isMobile = width < 600;
    this.calendarOptions.headerToolbar = {
      left: 'prev,next today',
      center: !isMobile ? 'title' : '',
      right: isMobile
        ? 'dayGridMonth,listDay'
        : 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    };
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setupCalendarOptions(event.target.innerWidth);
  }
}
