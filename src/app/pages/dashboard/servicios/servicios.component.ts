import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ApiService } from 'src/app/services/ApiService';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { HttpHeaders } from '@angular/common/http';

// Interfaz para la solicitud de servicio
export interface SolicitudServicio {
  tipoServicio: string;
  fecha: Date | null;
  observaciones: string;
}

// Interfaz para el token decodificado
interface DecodedToken {
  emailId: string;
  userId: number;
  // Añade aquí otros campos que puedan estar presentes en el token
}

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.sass']
})
export class ServiciosComponent implements OnInit {
  private userId: number | null;
  public userEmail: string | null;
  private token: string | null;
  solicitud: SolicitudServicio = {
    tipoServicio: '',
    fecha: null,
    observaciones: ''
  };

  // Mapeo de tipos de servicio
  tipoServicioMap: { [key: string]: number } = {
    'Aplicación': 1,
    'Servicio Topográfico': 2,
    // Otros tipos de servicio...
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.token = this.authService.getToken();
    if (this.token) {
      const decoded: DecodedToken = jwtDecode(this.token);
      this.userId = decoded.userId;
      this.userEmail = decoded.emailId;
      console.log('este es mail', this.userEmail);
      console.log('este es id', this.userId);
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }

  ngOnInit(): void {

  }

  onFechaChange(event: MatDatepickerInputEvent<Date>): void {
    this.solicitud.fecha = event.value;
  }


  // Método para formatear la fecha
  formatDate(date: Date | null): string {
    if (!date) {
      return '';
    }

    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

    const day = localDate.getDate();
    const month = localDate.getMonth() + 1;
    const year = localDate.getFullYear();

    const dayFormatted = this.formatNumberWithZero(day);
    const monthFormatted = this.formatNumberWithZero(month);

    return `${dayFormatted}/${monthFormatted}/${year}`;
  }

  private formatNumberWithZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }


  onSubmit(): void {
    if (this.userId !== null && this.token) {
      // Loguear el token antes de la solicitud
      console.log('Token enviado:', this.token);

      this.apiService.getFields(this.userId).subscribe(
        (fieldsResponse: any) => {
          console.log('Respuesta de campos:', fieldsResponse);

          const fieldId = fieldsResponse?.list?.[0]?.[0]?.id || null;

          if (fieldId) {
            const formattedDate = this.formatDate(this.solicitud.fecha);
            const servicio = {
              dateOfService: formattedDate,
              observations: this.solicitud.observaciones,
              idTypeService: this.tipoServicioMap[this.solicitud.tipoServicio]
            };

            // Loguear los datos del servicio antes de la solicitud
            console.log('Datos del servicio a enviar:', servicio);

            this.apiService.addAppService(fieldId, servicio).subscribe(
              (serviceResponse: any) => {
                console.log('Respuesta del servicio:', serviceResponse);
                this.toastr.success('Solicitud de servicio enviada al campo específico');
                // Manejar la respuesta del servicio si es necesario
              },
              (serviceError: any) => {
                this.toastr.error('Error al enviar la solicitud de servicio al campo específico');
                console.error('Error al agregar el servicio al campo:', serviceError);
                // Manejar el error del servicio si es necesario
              }
            );
          } else {
            console.error('No se encontró ningún campo para este usuario');
          }
        },
        (fieldsError: any) => {
          console.error('Error al cargar los campos del usuario:', fieldsError);
          // Manejar el error al cargar los campos si es necesario
        }
      );
    }
  }





}
