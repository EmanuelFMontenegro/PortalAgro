import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  selector: 'app-cargar-lote',
  templateUrl: './cargar-lote.component.html',
  styleUrls: ['./cargar-lote.component.sass'],
})
export class CargarLoteComponent {
  currentPlotId: number | null = null;
  public buttonText: string = 'Cargar Lote';
  nombre: string = '';
  apellido: string = '';
  descripcion: string = '';
  dni: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  persona: any = {};
  plantations: any[] = [];
  campoForm: FormGroup;
  FieldId: number = 0;
  filteredPlantations: Observable<any[]> = new Observable<any[]>();
  filtroPlantations = new FormControl('');
  private userId: number | any;
  private personId: number | any;
  public userEmail: string | null = null;

  campoData = {
    name: '',
    plantation: '',
    dimensions: '',
  };
  nameTouched = false;
  dimensionsTouched = false;
  plantationTouched = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.campoForm = this.fb.group({
      name: ['', Validators.required],
      dimensions: ['', [Validators.required, Validators.min(1)]],
      observation: [''],
      plantation: ['', Validators.required],
    });
  }
  clearStoredPlotId(): void {
    const storedPlotId = localStorage.getItem('plotId');
    if (storedPlotId) {
      localStorage.removeItem('plotId');
      this.currentPlotId = null;
      this.campoForm.reset();
      this.buttonText = 'Cargar Lote';
      console.log('Plot ID eliminado:', storedPlotId);
    }
  }
  ngOnInit(): void {
    console.log('ngOnInit en CargarLoteComponent');
    this.cargarDatosDeUsuario();
    this.userEmail = this.authService.getUserEmail();
    this.decodeToken();
    this.obtenerPlantaciones();
    console.log('Modo edición en ngOnInit:', this.currentPlotId);

    // Agregar lógica para limpiar plotId si existe
    const storedPlotId = localStorage.getItem('plotId');
    if (storedPlotId) {
      localStorage.removeItem('plotId');
      this.currentPlotId = null;
      this.campoForm.reset();
      this.buttonText = 'Cargar Lote';
      console.log('Plot ID eliminado:', storedPlotId);
    }
  }

  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;
    }
  }

  obtenerPlantaciones() {
    this.apiService.getAllTypePlantationOperador().subscribe(
      (plantations) => {
        this.plantations = plantations;
        this.filteredPlantations = this.filtroPlantations.valueChanges.pipe(
          startWith(''),
          map((value) => {
            if (typeof value === 'string') {
              return this.filtrarPlantaciones(value);
            } else {
              return [];
            }
          })
        );
      },
      (error) => {
        console.error('Error al obtener las plantaciones', error);
      }
    );
  }

  private filtrarPlantaciones(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.plantations.filter((planta) =>
      planta.name.toLowerCase().includes(filterValue)
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
          .getPersonByIdOperador(this.userId, this.personId)
          .subscribe(
            (data) => {
              this.nombre = data.name;
              this.apellido = data.lastname;
              this.dni = data.dni;
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
      }
    } else {
      this.userId = null;
      this.userEmail = null;
    }

    const campoSeleccionadoParam = localStorage.getItem('campoSeleccionado');
    const campoSeleccionado = campoSeleccionadoParam
      ? JSON.parse(campoSeleccionadoParam)
      : null;

    if (campoSeleccionado) {
      const campoId = campoSeleccionado.id;
      this.FieldId = campoId;
      const plotId = localStorage.getItem('plotId');
      console.log('Plot ID:', plotId);
      this.decodeToken();
      if (plotId) {
        const plotIdNumber = parseInt(plotId, 10);
        this.apiService
          .getPlotByIdOperador(this.userId, this.FieldId, plotIdNumber)
          .subscribe(
            (lote) => {
              console.log('Datos del lote:', lote);
              this.currentPlotId = plotIdNumber;
              this.campoData = {
                name: lote.name,
                plantation: lote.type_plantation_id,
                dimensions: lote.dimensions,
              };
              this.campoForm.patchValue({
                name: lote.name,
                plantation: lote.type_plantation_id,
                dimensions: lote.dimensions,
                observation: lote.descriptions,
              });
              this.buttonText = 'Actualizar Lote';
              console.log('Modo edición:', this.currentPlotId);
            },
            (error) => {
              console.error('Error al obtener los datos del lote:', error);
            }
          );
      }
    } else {
      this.campoForm.reset();
      this.buttonText = 'Cargar Lote';
      this.currentPlotId = null;
      console.log('Modo edición:', this.currentPlotId);
    }
  }

  cargarLotes(): void {
    console.log('Cargar Lote method called');
    console.log('Form value:', this.campoForm.value);
    console.log('Current Plot ID:', this.currentPlotId);
    if (this.campoForm.valid && !this.currentPlotId) {
      const nameControl = this.campoForm.get('name');
      const dimensionsControl = this.campoForm.get('dimensions');
      const observationControl = this.campoForm.get('observation');
      const plantationControl = this.campoForm.get('plantation');

      if (
        nameControl &&
        dimensionsControl &&
        observationControl &&
        plantationControl
      ) {
        const newPlotData: any = {
          name: nameControl.value,
          dimensions: dimensionsControl.value,
          descriptions: observationControl.value,
          type_plantation_id: plantationControl.value,
        };

        this.apiService
          .addPlotOperador(this.userId, this.FieldId, newPlotData)
          .subscribe(
            () => {
              this.toastr.success('Lote creado con éxito', 'Éxito');
              this.campoForm.reset();
              this.router.navigate(['dashboard/lote']);
            },
            (error) => {
              if (error.error && error.error.message) {
                this.toastr.error(
                  'Ya existe un Lote con ese Nombre',
                  'Atención'
                );
              } else {
                this.toastr.error(
                  'Error al registrar el lote. Detalles: ' + error.message,
                  'Error'
                );
              }
            }
          );
      } else {
        console.error(
          'Error: Al menos uno de los campos del formulario es nulo.'
        );
        this.toastr.warning(
          'Por favor, completa todos los campos del Lote',
          'Atención'
        );
      }
    } else {

    }
  }

  actualizarLote(): void {
    console.log('Actualizar Lote method called');
    console.log('Form value:', this.campoForm.value);
    console.log('Current Plot ID:', this.currentPlotId);
    if (this.campoForm.valid && this.currentPlotId) {
      const nameControl = this.campoForm.get('name');
      const dimensionsControl = this.campoForm.get('dimensions');
      const observationControl = this.campoForm.get('observation');
      const plantationControl = this.campoForm.get('plantation');

      if (
        nameControl &&
        dimensionsControl &&
        observationControl &&
        plantationControl
      ) {
        const updatedPlotData: any = {
          name: nameControl.value,
          dimensions: dimensionsControl.value,
          descriptions: observationControl.value,
          type_plantation_id: plantationControl.value,
        };

        this.apiService
          .updatePlotOperador(
            this.userId,
            this.FieldId,
            this.currentPlotId,
            updatedPlotData
          )
          .subscribe(
            () => {
              this.toastr.success('Lote actualizado con éxito', 'Éxito');
              this.router.navigate(['dashboard/lote']);
            },
            (error) => {
              console.error('Error al actualizar el lote:', error);
              this.toastr.error(
                'Error al actualizar el lote. Por favor, inténtalo de nuevo más tarde.',
                'Error'
              );

            }
          );
      } else {
        console.warn(
          'Advertencia: Al menos uno de los campos del formulario es nulo.'
        );
        this.toastr.warning(
          'Por favor, completa todos los campos del Lote',
          'Atención'
        );
      }
    } else {
    }
  }

  cancelar() {
    this.router.navigate(['dashboard/inicio']);
  }
}
