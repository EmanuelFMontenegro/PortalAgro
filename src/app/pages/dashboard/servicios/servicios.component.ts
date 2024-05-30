import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ApiService } from 'src/app/services/ApiService';
import { AuthService } from 'src/app/services/AuthService';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';

// Interfaz para la solicitud de servicio
interface SolicitudServicio {
  chacra: string;
  cultivo: string;
  lote: string;
  hectareas: number;
  fecha: Date | null;
  observaciones: string;
}

interface VerServicio {
  nombreChacra: string;
  fecha: string;
  plantacion: string;
  hectareas: number;
  // Puedes añadir más propiedades según sea necesario para los acordeones
}

// Interfaz para el token decodificado
interface DecodedToken {
  emailId: string;
  userId: number;
}

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.sass'],
})
export class ServiciosComponent implements OnInit {
  formularioVisible: string | null = null;
  solicitud: SolicitudServicio = {
    chacra: '',
    cultivo: '',
    lote: '',
    hectareas: 0,
    fecha: null,
    observaciones: ''
  };
  lotesAgregados: string[] = [];
  private userId: number | null = null;
  public userEmail: string | null = null;
  private token: string | null = null;

  servicios: string[] = ['Servicio 1', 'Servicio 2', 'Servicio 3']; // Lista de servicios disponibles
  servicioSeleccionado: string | null = null; // Servicio seleccionado para mostrar detalles

  servicioVisualizado: VerServicio = {
    nombreChacra: 'Chacra de Ejemplo',
    fecha: '2024-06-02',
    plantacion: 'Maíz',
    hectareas: 15,
    // Puedes inicializar más propiedades según sea necesario para los acordeones
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
    }
  }

  ngOnInit(): void {}

  mostrarFormulario(formulario: string) {
    this.formularioVisible = formulario;
  }

  onFechaChange(event: MatDatepickerInputEvent<Date>): void {
    this.solicitud.fecha = event.value;
  }

  // Método para formatear la fecha
  formatDate(date: Date | null): string {
    if (!date) {
      return '';
    }

    const localDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000
    );

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

  aplicarChacra() {
    // Lógica para aplicar chacra seleccionada
  }

  filtrarLotes() {
    // Lógica para filtrar lotes según el cultivo seleccionado
  }

  agregarLote() {
    if (this.solicitud.lote) {
      this.lotesAgregados.push(this.solicitud.lote);
      this.solicitud.lote = ''; // Limpiar el campo de lote después de agregar
    }
  }

  cancelar() {
    this.formularioVisible = null;
  }

  onSubmitSolicitar(): void {
    if (this.userId !== null && this.token) {
      this.apiService.getFields(this.userId).subscribe(
        (fieldsResponse: any) => {
          const fieldId = fieldsResponse?.list?.[0]?.[0]?.id || null;

          if (fieldId) {
            const formattedDate = this.formatDate(this.solicitud.fecha);
            const servicio = {
              dateOfService: formattedDate,
              observations: this.solicitud.observaciones,
              hectareas: this.solicitud.hectareas,
              lotes: this.lotesAgregados
            };

            this.apiService.addTypeServicesAdmin(servicio).subscribe(
              (serviceResponse: any) => {
                this.toastr.success('Service request sent to the specific field');
                // Handle service response if necessary
              },
              (serviceError: any) => {
                this.toastr.error('Error sending service request to the specific field');
                console.error('Error adding service to the field:', serviceError);
                // Handle service error if necessary
              }
            );
          } else {
            console.error('No field found for this user');
          }
        },
        (fieldsError: any) => {
          console.error('Error loading user fields:', fieldsError);
          // Handle error loading fields if necessary
        }
      );
    }
  }

  // Método para ver detalles del servicio seleccionado
  verServicio(): void {
    // Implementar lógica para cargar detalles del servicio seleccionado
    // Ejemplo básico:
    if (this.servicioSeleccionado) {
      // Aquí deberías cargar los detalles del servicio desde tu API o estructura de datos
      // y actualizar servicioVisualizado con los detalles correspondientes.
      this.servicioVisualizado = {
        nombreChacra: `${this.servicioSeleccionado} - Chacra`,
        fecha: '2024-06-02',
        plantacion: 'Maíz',
        hectareas: 15,
        // Actualiza con más propiedades según sea necesario
      };
      this.formularioVisible = 'ver'; // Mostrar sección de visualización del servicio
    }
  }
}
