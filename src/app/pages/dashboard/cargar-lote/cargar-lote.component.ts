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
import { LoteComponent } from '../lote/lote.component';

interface CustomJwtPayload {
  userId: number;
  sub: string;
}

interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
}
interface Lote {
  id: number;
  name: string;
  descriptions: string;
  dimensions: number;
  typeCrop: {
    id: number;
    name: string;
  };
  url_profile: string | null;
  plant_name?: string;
  type_crop_id?: number;
}

@Component({
  selector: 'app-cargar-lote',
  templateUrl: './cargar-lote.component.html',
  styleUrls: ['./cargar-lote.component.sass'],
})
export class CargarLoteComponent {
  currentPlotId: number | null = null;
  public buttonText: string = 'Cargar Lote';
  ActualPlantationName: string = ''; //esta variable contiene el nombre de la plantacion actual para editar luego.-
  nombre: string = '';
  apellido: string = '';
  descripcion: string = '';
  dni: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  persona: any = {};
  plantations: any[] = [];
  loteForm: FormGroup;
  FieldId: number = 0;
  filteredPlantations: Observable<any[]> = new Observable<any[]>();
  filtroPlantations = new FormControl('');
  private userId: number | any;
  private personId: number | any;
  public userEmail: string | null = null;

  loteData = {
    // name: '',
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
    this.loteForm = this.fb.group({
      // name: ['', Validators.required],
      dimensions: ['', [Validators.required, Validators.min(1)]],
      observation: [''],
      plantation: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarDatosDeUsuario();
    this.userEmail = this.authService.getUserEmail();
    this.decodeToken();
    this.obtenerPlantaciones();

    const storedPlotId = localStorage.getItem('plotId');
    const storedPlotData = localStorage.getItem('plotData');

    if (storedPlotId && storedPlotData) {
      localStorage.removeItem('plotId');
      localStorage.removeItem('plotData');

      const plotIdNumber = parseInt(storedPlotId, 10);
      const plotData: Lote = JSON.parse(storedPlotData);

      // Save the ID of the current plantation before loading plot data
      const previousPlantationId = plotData.typeCrop.id;

      this.currentPlotId = plotIdNumber;
      this.loteData = {
        plantation: plotData.typeCrop.id.toString(),
        dimensions: plotData.dimensions.toString(),
      };
      this.loteForm.patchValue({
        plantation: plotData.typeCrop.id.toString(),
        dimensions: plotData.dimensions.toString(),
        observation: plotData.descriptions,
      });

     
      this.loteForm.addControl('previousPlantation', new FormControl(previousPlantationId));

      this.buttonText = 'Update Lote';
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
    this.apiService.getAllTypeCropOperador().subscribe(
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

    const loteSeleccionadoParam = localStorage.getItem('loteSeleccionado');
    const loteSeleccionado = loteSeleccionadoParam
      ? JSON.parse(loteSeleccionadoParam)
      : null;

    if (loteSeleccionado) {
      const loteId = loteSeleccionado.id;
      this.FieldId = loteId;
      const plotId = localStorage.getItem('plotId');

      this.decodeToken();
      if (plotId) {
        const plotIdNumber = parseInt(plotId, 10);
        this.apiService
          .getPlotByIdOperador(this.userId, this.FieldId, plotIdNumber)
          .subscribe(
            (lote) => {
              this.currentPlotId = plotIdNumber;
              this.loteData = {
                // name: lote.name,
                plantation: lote.type_crop_id,
                dimensions: lote.dimensions,
              };
              this.loteForm.patchValue({
                // name: lote.name,
                plantation: lote.type_crop_id,
                dimensions: lote.dimensions,
                observation: lote.descriptions,
              });
              this.buttonText = 'Actualizar Lote';
            },
            (error) => {
              console.error('Error al obtener los datos del lote:', error);
            }
          );
      }
    } else {
      this.loteForm.reset();
      this.buttonText = 'Cargar Lote';
      this.currentPlotId = null;
    }
  }

  cargarLotes(): void {
    if (this.loteForm.valid) {
      const dimensionsControl = this.loteForm.get('dimensions');
      const observationControl = this.loteForm.get('observation');
      const plantationControl = this.loteForm.get('plantation');

      if (dimensionsControl && observationControl && plantationControl) {
        const newPlotData: any = {
          dimensions: dimensionsControl.value,
          descriptions: observationControl.value,
          type_crop_id: plantationControl.value,
        };

        this.apiService
          .addPlotOperador(this.userId, this.FieldId, newPlotData)
          .subscribe(
            () => {
              this.toastr.success('Lote creado con éxito', 'Éxito');
              this.loteForm.reset();
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
      }
    }
  }

  actualizarLote(): void {
    if (this.loteForm.valid && this.currentPlotId) {
      const dimensionsControl = this.loteForm.get('dimensions');
      const observationControl = this.loteForm.get('observation');
      const plantationControl = this.loteForm.get('plantation');

      if (dimensionsControl && observationControl && plantationControl) {
        const updatedPlotData: any = {
          dimensions: dimensionsControl.value,
          descriptions: observationControl.value,
          type_crop_id: plantationControl.value,
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
      }
    }
  }

  cancelar() {
    this.router.navigate(['dashboard/inicio']);
  }
}
