import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

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
  selector: 'app-campo',
  templateUrl: './campo.component.html',
})
export class CampoComponent implements OnInit {
  nombre: string = '';
  apellido: string = '';
  descripcion: string = '';
  dni: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  modoEdicion: boolean = false;
  persona: any = {};
  localidades: any[] = [];
  campoForm: FormGroup;
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
      location: '',
    },
  };
  nameTouched = false;
  dimensionsTouched = false;
  geolocationTouched = false;
  locationTouched = false;
  addressTouched = false;
  observationTouched = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.campoForm = this.fb.group({
      address: ['', Validators.required],
      localidad: ['', Validators.required],
      name: ['', Validators.required],
      dimensions: ['', [Validators.required, Validators.min(1)]],
      observation: [''],
    }); 
  }

  ngOnInit(): void {
    this.cargarDatosDeUsuario();
    this.userEmail = this.authService.getUserEmail();
    this.decodeToken();
    this.campoData.geolocation = '';
    this.obtenerLocalidades();
  }

  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;
    }
  }

  obtenerLocalidades() {
    this.apiService.getLocationMisiones('location').subscribe(
      (localidades) => {
        this.localidades = localidades;
        this.filteredLocalidades = this.filtroLocalidades.valueChanges.pipe(
          startWith(''),
          map((value) => this.filtrarLocalidades(value ?? ''))
        );
      },
      (error) => {
        console.error('Error al obtener las localidades', error);
      }
    );
  }

  private filtrarLocalidades(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.localidades.filter((loc) =>
      loc.name.toLowerCase().includes(filterValue)
    );
  }

  cargarDatosDeUsuario() {
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;

      this.personId = this.userId;

      if (this.userId !== null && this.personId !== null) {
        this.apiService
          .getPersonByIdProductor(this.userId, this.personId)
          .subscribe(
            (data) => {
              this.nombre = data.name;
              this.apellido = data.lastname;
              this.dni = data.dni;
              this.descriptions = data.descriptions;
              this.telephone = data.telephone;
              const localidad = this.localidades.find(
                (loc) => loc.id === data.location_id
              );
              this.locationId = localidad ? localidad.name.toString() : '';
            },
            (error) => {
              console.error(
                'Error al obtener nombre y apellido del usuario:',
                error
              );
            }
          );
      }
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }

  registrarCampo(): void {
    console.log('Registrando campo...');
    // Verificar si el usuario está autenticado
    if (!this.userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    // Verificar si el formulario es válido
    if (this.campoForm.valid) {
      // Obtener referencias a los controles del formulario
      const nameControl = this.campoForm.get('name');
      const dimensionsControl = this.campoForm.get('dimensions');
      const addressControl = this.campoForm.get('address');
      const localidadControl = this.campoForm.get('localidad');
      const observationControl = this.campoForm.get('observation');

      // Verificar que los controles no son nulos
      if (nameControl && dimensionsControl && addressControl && localidadControl && observationControl) {
        // Construir objeto campoData para enviar al backend
        const fixedGeolocation = '';
        const campoData: any = {
          name: nameControl.value,
          dimensions: dimensionsControl.value,
          geolocation: fixedGeolocation,
          address: {
            address: addressControl.value,
            location_id: localidadControl.value,
          },
          observation: observationControl.value,
        };

        // Llamar al servicio API para agregar el campo
        this.apiService.addField(this.userId, campoData).subscribe(
          () => {
            // Éxito: mostrar mensaje y redirigir
            this.toastr.success('Campo registrado con éxito', 'Éxito');
            this.campoForm.reset();
            this.router.navigate(['dashboard/chacras']);
          },
          (error) => {
            // Error al registrar el campo: mostrar mensaje de error
            console.error('Error al registrar el campo:', error);
            if (error.error && error.error.message) {
              this.toastr.error(
                'La descripción del campo es muy grande.',
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
        // Al menos uno de los controles del formulario es nulo
        console.error('Error: Al menos uno de los controles del formulario es nulo.');
      }
    } else {
      // El formulario no es válido: mostrar mensaje de error
      this.toastr.error(
        'Por favor, completa todos los campos requeridos',
        'Error'
      );
    }
  }


  cancelar() {
    this.router.navigate(['dashboard/chacras']);
  }
}
