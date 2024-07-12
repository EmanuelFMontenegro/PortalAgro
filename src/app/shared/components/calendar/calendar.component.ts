import { Component, ChangeDetectorRef, Input, OnInit } from '@angular/core';
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
  styleUrls: ['./calendar.component.sass']
})
export class CalendarComponent implements OnInit {
  @Input() events!: EventInput[];
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true, 
    selectable: true, 
    selectMirror: true,
    dayMaxEvents: true,
    locale: esLocale,
    longPressDelay: 1,
    eventClick: this.handleEventClick.bind(this)
  };
  currentEvents: EventApi[] = [];

  constructor(private changeDetector: ChangeDetectorRef,public dialogRef: MatDialog) {}

  ngOnInit() {
    this.calendarOptions.events = this.events;
    this.events.forEach(event => {
      event.backgroundColor = '#3788d8';
    })
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.dialogRef.open(CalendarPopupComponent, {
      data: {
        event: clickInfo.event
      }
    });
 
  }
}
