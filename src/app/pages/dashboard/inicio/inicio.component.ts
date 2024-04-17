import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

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
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.sass'],
})
export class InicioComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  nombre: string = '';
  apellido: string = '';
  descripcion: string = '';
  dniCuit: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  nombreCampo: string = '';
  localidad: string = '';
  nombreLocalidad: string = '';
  private userId: number | any;
  private personId: number | any;
  public userEmail: string | null = null;
  localidades: any[] = [];
  campos: any[] = [];
  campoData = {
    name: '',
    dimensions: '',
    geolocation: '',
    observation: '',
    address: {
      address: '',
      location: '',
    },
  };

  addressTouched = false;
  locationTouched = false;
  nameTouched = false;
  dimensionsTouched = false;
  observationTouched = false;
  campoSeleccionado: any;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.decodeToken();
    this.campoData.geolocation = '';
    this.cargarCampos();
    this.cargarDatosDeUsuario();
  }

  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;
    }
  }

  BtnRegisterCampos(): void {
    this.router.navigate(['/dashboard/campo']);
  }

  cargarCampos() {
    if (!this.userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    this.apiService.getFields(this.userId).subscribe(
      (response) => {
        if (response.list && response.list.length > 0) {
          this.campos = response.list[0];
        } else {
          console.error('La lista de campos está vacía o no está definida');
        }
      },
      (error) => {
        console.error('Error al obtener campos:', error);
      }
    );
  }
  cargarDatosDeUsuario() {
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;

      this.personId = this.userId;

      if (this.userId !== null && this.personId !== null) {
        this.apiService.getLocationMisiones('location').subscribe(
          (localidades) => {
            this.localidades = localidades;

            let nombreLocalidad: string = '';

            this.apiService
              .getPersonByIdOperador(this.userId, this.personId)
              .subscribe(
                (data) => {
                  const localidad = this.localidades.find(
                    (loc) => loc.id === data.location_id
                  );
                  nombreLocalidad = localidad ? localidad.name : '';

                  this.nombreLocalidad = nombreLocalidad;
                  this.nombre = data.name;
                  this.apellido = data.lastname;
                  this.dniCuit = data.dniCuit;
                  this.descriptions = data.descriptions;
                  this.telephone = data.telephone;
                },
                (error) => {
                  console.error(
                    'Error al obtener nombre y apellido del usuario:',
                    error
                  );
                }
              );
          },
          (error) => {
            console.error('Error al obtener las localidades', error);
          }
        );
      }
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }

  geolocalizar() {
    if (this.campoSeleccionado) {
      this.router.navigate(['dashboard/geolocalizacion'], {
        state: { campoSeleccionado: this.campoSeleccionado },
      });
    } else {
      this.toastr.warning('No se ha seleccionado ningún campo', 'Advertencia');
    }
  }

  registrarCampo(): void {
    if (!this.userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    if (this.isValidForm()) {
      this.apiService.addField(this.userId, this.campoData).subscribe(
        () => {
          this.toastr.success('Campo registrado con éxito', 'Éxito');
          this.campoData = {
            name: '',
            dimensions: '',
            geolocation: '',
            observation: '',
            address: {
              address: '',
              location: '',
            },
          };
          this.router.navigate(['dashboard/geolocalizacion']);
        },
        (error) => {
          console.error('Error al registrar el campo:', error);
          if (error.error && error.error.message) {
            this.toastr.error(
              'Ya Existe un campo registrado con este nombre.',
              'Atención'
            );
          } else {
            this.toastr.error(
              'Error al registrar el campo. Detalles: ' + error.message,
              'Error'
            );
          }
        }
      );
    } else {
      this.toastr.error(
        'Por favor, completa todos los campos requeridos',
        'Error'
      );
    }
  }
  obtenerLocalidades() {
    this.apiService.getLocationMisiones('location').subscribe(
      (localidades) => {
        this.localidades = localidades;
        console.log('Localidades:', this.localidades);
      },
      (error) => {
        console.error('Error al obtener las localidades', error);
      }
    );
  }

  isValidForm(): boolean {
    const dimensions = Number(this.campoData.dimensions);
    const isAddressValid = this.campoData.address.address.trim() !== '';
    const isLocationValid = this.campoData.address.location.trim() !== '';
    const isNameValid = this.campoData.name.trim() !== '';
    const isObservationValid = this.campoData.observation.trim() !== '';
    const areDimensionsValid = !isNaN(dimensions) && dimensions > 0;

    return (
      isAddressValid &&
      isLocationValid &&
      isNameValid &&
      areDimensionsValid &&
      isObservationValid
    );
  }
  verMas(campo: any): void {
    this.campoSeleccionado = campo;
    localStorage.setItem(
      'campoSeleccionado',
      JSON.stringify(this.campoSeleccionado)
    );

    this.router.navigate(['dashboard/detalle-campo']);
  }
}
