import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface CustomJwtPayload {
  userId: number;
  sub: string;
}

interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
}
@Component({
  selector: 'app-detalle-campo',
  templateUrl: './detalle-campo.component.html',
  styleUrls: ['./detalle-campo.component.sass']
})
export class DetalleCampoComponent {
  nombre: string = '';
  campo:any;
  apellido: string = '';
  descripcion: string = '';
  dni: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  modoEdicion: boolean = false;
  persona: any = {};
  localidades: any[] = [];
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades = new FormControl('');
  private userId: number | any;
  private personId: number | any;
  public userEmail: string | null = null;

  campoData = {
    name: '',
    dimensions: '',
    geolocation: '',
    address: {
      address: '',
      location: ''
    }
  };
  nameTouched = false;
  dimensionsTouched = false;
  geolocationTouched = false;
  locationTouched = false;
  addressTouched = false;
  observationTouched = false;
  campoSeleccionado: any = {};

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute

  ) {


  }

  ngOnInit(): void {
    this.cargarDatosDeUsuario();
    this.userEmail = this.authService.getUserEmail();
    this.decodeToken();

    this.route.paramMap.subscribe(params => {
      const campoSeleccionadoParam = params.get('campoSeleccionado');
      if (campoSeleccionadoParam) {
        this.campoSeleccionado = JSON.parse(campoSeleccionadoParam);
      }
    });
  }


  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;
    }
  }

  cargarDatosDeUsuario() {
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;

      this.personId = this.userId;

      if (this.userId !== null && this.personId !== null) {
        this.apiService.getPersonByIdOperador(this.userId, this.personId).subscribe(
          (data) => {
            this.nombre = data.name;
            this.apellido = data.lastname;
            this.dni = data.dni;
            this.descriptions = data.descriptions;
            this.telephone = data.telephone;
            const localidad = this.localidades.find((loc) => loc.id === data.location_id);
            this.locationId = localidad ? localidad.name.toString() : '';

          },
          (error) => {
            console.error('Error al obtener nombre y apellido del usuario:', error);
          }
        );
      }
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }
  TraerDatosdeCampo(): void {
    if (!this.userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    // Asumo que necesitas el ID del campo, asegúrate de tener el ID correcto o ajusta según sea necesario
    const campoId = 1; // Reemplaza con el ID real del campo que deseas traer

    // Realizar la solicitud para obtener los datos del campo por su ID
    this.apiService.getFields(this.userId).subscribe(
      (campos) => {

        const campoSeleccionado = campos.find((campo: { id: number }) => campo.id === campoId);


        if (campoSeleccionado) {
          // Asignar los datos del campo al objeto campoSeleccionado
          this.campoSeleccionado = campoSeleccionado;
          console.log("datos del campo vermas ",this.campoSeleccionado)
          // Puedes agregar más lógica aquí si es necesario
        } else {
          this.toastr.error('Campo no encontrado', 'Error');
        }
      },
      (error) => {
        console.error('Error al obtener la lista de campos:', error);
        // Manejar el error según tus necesidades, por ejemplo, mostrar un mensaje de error
        this.toastr.error('Error al obtener la lista de campos', 'Error');
      }
    );
  }




  geolocalizar() {
    // Implementación de la función geolocalizar
  }

  verLotes() {
    this.router.navigate(['dashboard/lote']);
      }



  cancelar() {
    this.router.navigate(['dashboard/inicio']);
  }
}


