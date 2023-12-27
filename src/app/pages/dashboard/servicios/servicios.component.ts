import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormatDatePipe } from 'src/app/format-date.pipe';
import { Router } from '@angular/router'; // Importar Router


export interface SolicitudServicio {
  tipoServicio: string;
  fecha: Date | null; // Cambiado a Date para trabajar con el datepicker
  observaciones: string;
}

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.sass']
})
export class ServiciosComponent implements OnInit {
  solicitud: SolicitudServicio = {
    tipoServicio: '',
    fecha: null, // Inicializado como null
    observaciones: ''
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onFechaChange(event: MatDatepickerInputEvent<Date>): void {
    this.solicitud.fecha = event.value;
  }

  onSubmit(): void {
    console.log('Datos enviados:', this.solicitud);
    this.router.navigate(['/dashboard/geolocalizacion']);
  }
}
