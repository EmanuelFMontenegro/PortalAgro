import { EventInput } from '@fullcalendar/core';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  
  {
    id: createEventId(),
    title: 'Visita de rutina',
    description:'Visita de rutina a la empresa',
    start: TODAY_STR,
    end: TODAY_STR + 'T03:00:00',
  },
  {
    id: createEventId(),
    title: 'Reunión de equipo',
    description:'Visita de rutina a la empresa',
    start: TODAY_STR + 'T24:00:00',
    end: TODAY_STR + 'T24:00:00',
  },
  {
    id: createEventId(),
    title: 'Visita de rutina',
    description:'Visita de rutina a la empresa',
    start: TODAY_STR + 'T12:00:00',
    end: TODAY_STR + 'T15:00:00',
  },
];

export function createEventId() {
  return String(eventGuid++);
}