import {
  Component,
  Input,
  OnInit,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DateInput, EventInput, EventMountArg } from '@fullcalendar/core';
import { CalendarOptions, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { MatDialog } from '@angular/material/dialog';
import { CalendarPopupComponent } from 'src/app/shared/components/calendar-popup/calendar-popup.component';
interface CalendarEvent extends EventInput {
  title: string;
  start: Date;
  end?: Date;
  color?: string;
}

interface ProcessedCalendarEvent {
  title: string;
  start: Date;
  end?: Date;
  color: string;
  status: string; 
}

interface EventDetails {
  color: string;
  status: string;
}


type EventStatus = 'Pendiente' | 'En Curso' | 'Aprobada' | 'Solicitud';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})

/* Explicación de la funcionalidad del componente
   Recibimos una lista de events del componente padre, usamos el metodo handleEventDidMount para cambiar el color de los eventos
   segun su estado, para ello usamos el metodo getEventDetails():
        Esta func utiliza determineEventStatus() y createEventDetails(). para cachear el titulo, color y estado del evento
    En el Constructor : 
      Se inicializa el calendario con las opciones y config necesarias
      se llama a setupCalendarOptions() para configurar la altura del calendario segun el tamaño de la pantalla
      Se crean datos de prueba con el metodo setupTestData()
    
    
  

     */
export class CalendarComponent implements OnInit, OnChanges {
  initialized = false;
  @Input() events!: EventInput[];
  calendarOptions: CalendarOptions;
  currentEvents: EventApi[] = [];
  todayEvents: ProcessedCalendarEvent[] = [];
  weekEvents: ProcessedCalendarEvent[] = [];
  testEvents: EventInput[] = [];
  readonly STATUS_COLORS = {
    PENDIENTE: '#F2994A',
    EN_CURSO: '#2B78D4',
    APROBADA: '#3BA549',
    DEFAULT: '#B6C1CA'
  } as const;
  readonly STATUS_MAP: Record<EventStatus, { color: string; text: string }> = {
    'Pendiente': { color: this.STATUS_COLORS.PENDIENTE, text: 'Pendiente' },
    'En Curso': { color: this.STATUS_COLORS.EN_CURSO, text: 'En Curso' },
    'Aprobada': { color: this.STATUS_COLORS.APROBADA, text: 'Aprobada' },
    'Solicitud': { color: this.STATUS_COLORS.DEFAULT, text: 'Solicitud' }
  } as const;

  private colorCache = new Map<string, EventDetails>();
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
      events: this.events,
      eventDidMount: this.handleEventDidMount.bind(this),
      eventDisplay: 'block',
    };
    
    this.setupTestData();
    this.setupCalendarOptions(window.innerWidth);
  }

  ngOnInit() {
    this.initialized = true;
  }


  private getEventDetails(title: string): EventDetails {
    if (!title) {
      return this.createEventDetails('Solicitud');
    }

    const cached = this.colorCache.get(title);
    if (cached) {
      return { ...cached }; 
    }

    const status = this.determineEventStatus(title);
    const details = this.createEventDetails(status);
    
    this.colorCache.set(title, { ...details });
    return details;
  }
  private determineEventStatus(title: string): EventStatus {
    if (title.includes('Pendiente')) return 'Pendiente';
    if (title.includes('En Curso')) return 'En Curso';
    if (title.includes('Aprobada')) return 'Aprobada';
    return 'Solicitud';
  }

  private createEventDetails(status: EventStatus): EventDetails {
    const statusConfig = this.STATUS_MAP[status];
    return {
      color: statusConfig.color,
      status: statusConfig.text
    };
  }


  private processEvent(event: CalendarEvent): ProcessedCalendarEvent {
    const details = this.getEventDetails(event.title);
    return {
      ...event,
      color: details.color,
      status: details.status
    };
  }
  private createEventDate(baseDate: Date, hours: number, minutes: number): Date {
    return new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hours,
      minutes,
      0
    );
  }


  setupTestData(): void {
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    const tomorrow = new Date(baseDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(baseDate);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    /* this.testEvents = [
      {
        title: 'Servicio N° 001. Operador Juan Pérez. Pendiente',
        start: this.createEventDate(baseDate, 9, 0),
        end: this.createEventDate(baseDate, 10, 30)
      },
      {
        title: 'Servicio N° 002. Operador María García. En Curso',
        start: this.createEventDate(baseDate, 11, 0),
        end: this.createEventDate(baseDate, 12, 30)
      },
      {
        title: 'Servicio N° 003. Operador Carlos López. Aprobada',
        start: this.createEventDate(baseDate, 14, 0),
        end: this.createEventDate(baseDate, 15, 30)
      },
      {
        title: 'Servicio N° 004. Operador Ana Martínez. Pendiente',
        start: this.createEventDate(tomorrow, 10, 0),
        end: this.createEventDate(tomorrow, 11, 30)
      },
      {
        title: 'Servicio N° 005. Operador Pedro Sánchez. En Curso',
        start: this.createEventDate(tomorrow, 15, 0),
        end: this.createEventDate(tomorrow, 16, 30)
      },
      {
        title: 'Servicio N° 006. Operador Laura Torres. Aprobada',
        start: this.createEventDate(dayAfterTomorrow, 9, 30),
        end: this.createEventDate(dayAfterTomorrow, 11, 0)
      }
    ]; */
  }

  ngOnChanges(changes: SimpleChanges) {
     if (!this.initialized) {
      return;
    }
    if (changes['events']) {
      this.colorCache.clear();
      const allEvents = [...this.testEvents, ...changes['events'].currentValue];
      this.events = allEvents;
      this.filterEvents();
      this.calendarOptions.events = this.events;
    }
  }

  isValidDate(date: Date): date is Date {
    return date instanceof Date && !isNaN(date.getTime());
  }

  parseDate(dateInput: DateInput | undefined): Date | null {
    if (!dateInput) return null;
    
    if (dateInput instanceof Date) {
      return this.isValidDate(dateInput) ? dateInput : null;
    }

    try {
      if (typeof dateInput === 'string' || typeof dateInput === 'number') {
        const date = new Date(dateInput);
        return this.isValidDate(date) ? date : null;
      }
      if (Array.isArray(dateInput)) {
        const date = new Date(
          dateInput[0],
          dateInput[1] - 1,
          dateInput[2] || 1,
          dateInput[3] || 0,
          dateInput[4] || 0,
          dateInput[5] || 0
        );
        return this.isValidDate(date) ? date : null;
      }
      return null;
    } catch {
      return null;
    }
  }

  isValidEventInput(event: EventInput): boolean {
    return (
      typeof event.title === 'string' &&
      event.title.length > 0 &&
      event.start !== undefined &&
      this.parseDate(event.start) !== null
    );
  }

  convertToCalendarEvent(event: EventInput): CalendarEvent | null {
    if (!this.isValidEventInput(event)) return null;

    const startDate = this.parseDate(event.start);
    if (!startDate) return null;

    const endDate = this.parseDate(event.end);

    return {
      title: event.title as string,
      start: startDate,
      ...(endDate && { end: endDate })
    };
  }

  filterEvents() { 
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);

    const validEvents = this.events
      .map(event => this.convertToCalendarEvent(event))
      .filter((event): event is CalendarEvent => event !== null)
      .map(event => this.processEvent(event));

    this.todayEvents = validEvents.filter(event => 
      event.start.toDateString() === today.toDateString()
    );
 

    this.weekEvents = validEvents.filter(event => 
      event.start.toDateString() !== today.toDateString() &&  
      event.start > today && 
      event.start < endOfWeek
    ).sort((a, b) => a.start.getTime() - b.start.getTime());
  
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.dialogRef.open(CalendarPopupComponent, {
      data: { event: clickInfo.event },
      width: '320px'
    });
  }

  openEventDialog(event: ProcessedCalendarEvent): void {
    this.dialogRef.open(CalendarPopupComponent, {
      data: {
        event: event
      },
      width: '320px'
    });
  }
  handleEventDidMount(arg: EventMountArg) {
    if (arg.el && arg.event.title) {
      const { color } = this.getEventDetails(arg.event.title);
      arg.el.style.backgroundColor = color;
      arg.el.style.borderColor = color;
    }
  }

  setupCalendarOptions(width: number) {
    const isDesktop = width >= 1024;
    const isTablet = width >= 768 && width < 1024;
    
    this.calendarOptions.height = isDesktop ? 700 : 
                                 isTablet ? 500 : 
                                 400;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setupCalendarOptions(event.target.innerWidth);
  }
}
