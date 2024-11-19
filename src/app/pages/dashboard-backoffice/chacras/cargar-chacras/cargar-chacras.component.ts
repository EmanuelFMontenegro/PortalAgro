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

interface DatosUsuario {
  accept_license: boolean;
  account_active: boolean;
  canEdit: boolean | null;
  descriptions: string;
  dni: string;
  id: number;
  lastname: string;
  location: { id: number; name: string; department_id: number };
  name: string;
  telephone: string;
  username: string;
}

@Component({
  selector: 'app-cargar-chacras',
  templateUrl: './cargar-chacras.component.html',
})
export class CargarChacrasComponent implements OnInit {
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
  chacraForm: FormGroup;
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades = new FormControl('');
  public userId: number | any;
  private personId: number | any;
  public email: string | null = null;

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
    this.chacraForm = this.fb.group({
      address: ['', Validators.required],
      localidad: ['', Validators.required],
      name: ['', Validators.required],
      dimensions: ['', [Validators.required, Validators.min(1)]],
      observation: [''],
    });
  }

  ngOnInit(): void {
    this.email = this.authService.getUserEmail();
    this.campoData.geolocation = '';
    this.obtenerLocalidades();

    const perfilDataChacra = localStorage.getItem('idPerfilProd');
    if (perfilDataChacra) {
      const userId = parseInt(perfilDataChacra);
      if (!isNaN(userId)) {
        this.userId = userId;
        this.personId = userId;
        this.DatosUser(userId, userId);
      }
    }
  }

  DatosUser(userId: number, personId: number) {
    this.apiService.getPersonByIdProductor(userId, personId).subscribe(
      (response: DatosUsuario) => {
        if (response) {
          this.nombre = response.name;
          this.apellido = response.lastname;
          this.email = response.username;
          // this.contacto = response.telephone;
        } else {
          console.warn(
            'No se encontraron datos de la persona en la respuesta:',
            response
          );
        }
      },
      (error) => {
        console.error('Error al obtener los datos de la persona:', error);
      }
    );
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

  registrarChacra(userId: number) {
    // Verificar si el usuario está autenticado
    if (!userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    // Verificar si el formulario es válido
    if (this.chacraForm.valid) {
      // Obtener referencias a los controles del formulario
      const nameControl = this.chacraForm.get('name');
      const dimensionsControl = this.chacraForm.get('dimensions');
      const addressControl = this.chacraForm.get('address');
      const localidadControl = this.chacraForm.get('localidad');
      const observationControl = this.chacraForm.get('observation');

      // Verificar que los controles no son nulos
      if (
        nameControl &&
        dimensionsControl &&
        addressControl &&
        localidadControl &&
        observationControl
      ) {
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

        // Llama al Enpoint para cargar la Chacra
        this.apiService.addField(userId, campoData).subscribe(
          () => {
            // Éxito: mostrar mensaje y redirigir
            this.toastr.success('Chacra creada con éxito', 'Éxito');
            this.chacraForm.reset();
            this.router.navigate(['dashboard-backoffice/chacras-perfil']);
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
        console.error(
          'Error: Al menos uno de los controles del formulario es nulo.'
        );
      }
    } else {
      // El formulario no es válido: mostrar mensaje de error
      this.toastr.error(
        'Por favor, completa todos los campos requeridos',
        'Error'
      );
    }
  }

  volver() {
    window.history.back()
  }

  cancelar() {
    window.history.back()
  }
}
