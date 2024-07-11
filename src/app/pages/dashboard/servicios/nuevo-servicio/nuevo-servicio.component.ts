import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router, ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';


interface CustomJwtPayload {
  userId: number;
  sub: string;
}

interface DecodedToken {
  userId: number;
  emailId: string;
  sub: string;
  roles: string;
}

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
}

@Component({
  selector: 'app-nuevo-servicio',
  templateUrl: './nuevo-servicio.component.html',
  styleUrls: ['./nuevo-servicio.component.sass']
})
export class NuevoServicioComponent implements OnInit {

  placeholderText: string = 'Buscar por . . .';
  formularioVisible: string | null = null;
  solicitud: SolicitudServicio = {
    chacra: '',
    cultivo: '',
    lote: '',
    hectareas: 0,
    fecha: null,
    observaciones: ''
  };
  lotesAgregados: { lote: string, cultivo: string }[] = [];
  campos: any[] = [];
  chacras: any[] = []; // Array para almacenar las chacras
  cultivos: any[] = []; // Array para almacenar los cultivos
  private userId: number | null = null;
  seleccchacraId: number = 0;
  public userEmail: string | null = null;
  private token: string | null = null;
  lotes: { name: string, typeCrop: { name: string, id: number } }[] = [];
  servicios: string[] = ['Servicio 1', 'Servicio 2', 'Servicio 3'];
  servicioSeleccionado: string | null = null;
  servicioVisualizado: VerServicio = {
    nombreChacra: 'Chacra de Ejemplo',
    fecha: '2024-06-02',
    plantacion: 'Maíz',
    hectareas: 15,};

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ){this.token = this.authService.getToken();
    if (this.token) {
      const decoded: DecodedToken = jwtDecode(this.token);
      this.userId = decoded.userId;
      this.userEmail = decoded.emailId;
    }
    this.lotes = [];
    this.cultivos = [];
  }
  ngOnInit(): void {
    this.cargarCampos();
  }

  cargarCampos() {
    if (!this.userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    this.apiService.getFields(this.userId).subscribe(
      (response) => {
        if (response.list && response.list.length > 0 && Array.isArray(response.list[0])) {
          this.campos = response.list[0];
          // Verifica la estructura de cada campo antes de mapear
          this.campos.forEach((campo, index) => {
          });

          this.chacras = this.campos.map((campo: any) => {
            if (campo && campo.name) {
              return campo.name;
            } else {
              console.error("Campo sin nombre:", campo);
              return '';
            }
          }).filter(name => name !== ''); // Filtra nombres vacíos
        } else {
          console.error('La lista de campos está vacía o no está definida');
        }
      },
      (error) => {
        console.error('Error al obtener campos:', error);
      }
    );
  }

  mostrarFormulario(formulario: string) {
    this.formularioVisible = formulario;
    if (formulario === 'solicitar') {
      this.limpiarFormulario();
      this.cargarCampos();
    }
  }

  limpiarFormulario() {
    this.lotes = [];
    this.cultivos = [];
    this.solicitud = {
      chacra: '',
      cultivo: '',
      lote: '',
      hectareas: 0,
      fecha: null,
      observaciones: ''
    };
    this.lotesAgregados = [];
  }
  onFechaChange(event: MatDatepickerInputEvent<Date>): void {
    this.solicitud.fecha = event.value;
  }

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
    if (!this.userId || !this.solicitud.chacra) {
      this.toastr.error('Error: No se ha seleccionado una chacra.', 'Error');
      return;
    }
    const selectedChacra = this.campos.find(campo => campo.name === this.solicitud.chacra);
    if (!selectedChacra) {
      this.toastr.error('Error: Chacra seleccionada no encontrada.', 'Error');
      return;
    }
    const chacraId = selectedChacra.id;
    this.seleccchacraId = chacraId;
    this.apiService.getPlotsOperador(this.userId, chacraId).subscribe(
      (response) => {
        if (response.list && response.list.length > 0 && Array.isArray(response.list[0])) {
          const lotes = response.list[0];
          this.cultivos = lotes.map((lote: any) => ({
            id: lote.typeCrop?.id,
            name: lote.typeCrop?.name
          })).filter((cultivo: any) => !!cultivo.name);
        } else {
          console.error('La lista de lotes está vacía o no está definida');
        }
      },
      (error) => {
        console.error('Error al obtener lotes:', error);
      }
    );
  }

  filtrarLotes() {
    if (!this.userId || !this.solicitud.cultivo) {
      this.toastr.error('Seleccione un cultivo antes de filtrar los lotes.');
      return;
    }
    const cultivoInt: number = parseInt(this.solicitud.cultivo);
    const chacraId = this.seleccchacraId;
    if (isNaN(cultivoInt)) {
      this.toastr.error('Error al convertir el ID del cultivo a número.');
      return;
    }
    this.apiService.getPlotsOperador(this.userId, chacraId).subscribe(
      (response) => {
        if (response && response.list && response.list.length > 0 && Array.isArray(response.list[0])) {
          const lotesArray = response.list[0];
          this.lotes = lotesArray
            .filter((lote: any) => lote.typeCrop && lote.typeCrop.id === cultivoInt)
            .map((lote: any) => ({
              name: lote.name,
              typeCrop: {
                name: lote.typeCrop.name,
                id: lote.typeCrop.id
              }
            }));
        } else {
          console.error('No se encontraron lotes para el cultivo seleccionado.');
          this.toastr.error('No se encontraron lotes para el cultivo seleccionado.');
          this.lotes = [];
        }
      },
      (error) => {
        console.error('Error al obtener lotes por cultivo:', error);
        this.toastr.error('Error al obtener lotes por cultivo.');
        this.lotes = [];
      }
    );
  }

  agregarLote() {
    if (this.solicitud.lote) {
      const loteSeleccionado = this.lotes.find(lote => lote.name === this.solicitud.lote);
      if (loteSeleccionado) {
        // Obtener el nombre del cultivo asociado al lote seleccionado
        const cultivoAsociado = loteSeleccionado.typeCrop.name || '';

        // Verificar si el lote ya está en la lista lotesAgregados
        if (!this.lotesAgregados.find(l => l.lote === this.solicitud.lote)) {
          this.lotesAgregados.push({ lote: this.solicitud.lote, cultivo: cultivoAsociado });
          this.solicitud.lote = '';
        } else {
        }
      } else {
        console.error('No se encontró información del lote seleccionado.');
      }
    } else {
      console.error('No se ha seleccionado un lote.');
    }
  }

  eliminarLote(index: number) {
    this.lotesAgregados.splice(index, 1);
  }

  cancelar() {
    this.limpiarFormulario();
  }

  validateHectareas(): void {
    if (this.solicitud.hectareas < 0) {
      this.solicitud.hectareas = 0;
    }
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
          } else {
            console.error('No field found for this user');
          }
        },
        (fieldsError: any) => {
          console.error('Error loading user fields:', fieldsError);
        }
      );
    }
  }
  nuevoservicio(){
    this.router.navigate(['dashboard/nuevo-servicio']);
  }
  verServicio(): void {
    if (this.servicioSeleccionado) {
      this.servicioVisualizado = {
        nombreChacra: `${this.servicioSeleccionado} - Chacra`,
        fecha: '2024-06-02',
        plantacion: 'Maíz',
        hectareas: 15,
      };
      this.formularioVisible = 'ver';
    }
  }

  volver() {
    this.router.navigate(['dashboard/inicio']);
  }

  notificar(){

  }
  limpiar(){

  }
  buscar(){

  }
  generar(){

  }

}
