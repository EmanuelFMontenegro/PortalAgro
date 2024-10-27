import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RemovePlotService } from '../../../services/remove-plot.service';
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
})
export class CargarLoteComponent implements OnInit {
  currentPlotId: number | null = null;
  public buttonText: string = 'Cargar Lote';
  ActualPlantationName: string = '';
  AnteriorPlantationName: string = '';
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
  camposlect: any;
  FieldId: number;
  filteredPlantations: Observable<any[]> = new Observable<any[]>();
  filtroPlantations = new FormControl('');
  private userId: number | any;
  private personId: number | any;
  public userEmail: string | null = null;

  loteData = {
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
    private fb: FormBuilder,
    private removePloteService: RemovePlotService
  ) {
    this.loteForm = this.fb.group({
      dimensions: ['', [Validators.min(1)]],
      observation: [''],
      plantation: [''],
    });

    const campoSeleccionado = localStorage.getItem('campoSeleccionado');
    if (campoSeleccionado) {
      const campoSeleccionadoObj = JSON.parse(campoSeleccionado);
      this.FieldId = campoSeleccionadoObj.id;
    } else {
      this.FieldId = 0;
    }
  }

  ngOnInit(): void {
    const campoSeleccionadoParam = localStorage.getItem('campoSeleccionado');
    const campoSeleccionado = campoSeleccionadoParam
      ? JSON.parse(campoSeleccionadoParam)
      : null;
    if (campoSeleccionado) {
      this.camposlect = campoSeleccionado.name;
      const campoId = campoSeleccionado.id;
      this.FieldId = campoId;
    }
    this.cargarDatosDeUsuario();
    this.userEmail = this.authService.getUserEmail();
    this.decodeToken();
    this.obtenerPlantaciones();

    const storedPlotId = localStorage.getItem('plotId');
    const storedPlotData = localStorage.getItem('plotData');
    const previousPlantation = localStorage.getItem('previousPlantation');

    if (storedPlotId && storedPlotData) {
      const plotIdNumber = parseInt(storedPlotId, 10);
      const plotData: Lote = JSON.parse(storedPlotData);

      this.currentPlotId = plotIdNumber;
      this.loteData = {
        plantation: plotData.typeCrop.id.toString(),
        dimensions: plotData.dimensions.toString(),
      };

      this.loteForm.patchValue({
        // plantation: previousPlantation
        //   ? previousPlantation
        //   : plotData.typeCrop.id.toString(),
        plantation: plotData.typeCrop.id.toString(),
        dimensions: plotData.dimensions.toString(),
        observation: plotData.descriptions,
      });

      this.buttonText = 'Actualizar Lote';
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

        const storedPlotData = localStorage.getItem('plotData');
        if (storedPlotData) {
          const plotData: Lote = JSON.parse(storedPlotData);
          this.AnteriorPlantationName = plotData.typeCrop.name;
        }
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
          .getPersonByIdProductor(this.userId, this.personId)
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
              this.ActualPlantationName = lote.typeCrop.name;

              this.loteData = {
                plantation: lote.typeCrop.id.toString(), // Use ID instead of name
                dimensions: lote.dimensions.toString(),
              };
              this.loteForm.patchValue({
                plantation: lote.typeCrop.id.toString(), // Use ID instead of name
                dimensions: lote.dimensions.toString(),
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
    const dimensionsControl = this.loteForm.get('dimensions');
    const observationControl = this.loteForm.get('observation');
    const plantationControl = this.loteForm.get('plantation');

    const changes = {
      dimensions: dimensionsControl?.value,
      descriptions: observationControl?.value,
      type_crop_id: plantationControl?.value,
    };

    if (
      Object.values(changes).every((value) => value === null || value === '')
    ) {
      this.toastr.info('No se realizaron cambios', 'Información');
      return; // No se realizaron cambios, salir del método
    }

    this.apiService
      .addPlotOperador(this.userId, this.FieldId, changes)
      .subscribe(
        () => {
          this.toastr.success('Lote creado con éxito', 'Éxito');
          this.loteForm.reset();
          this.router.navigate(['dashboard/lote']);
        },
        (error) => {
          this.toastr.error(
            'Error al registrar el lote. Detalles: ' + error.message,
            'Error'
          );
        }
      );
  }

  actualizarLote(): void {
    if (!this.currentPlotId) return;

    const dimensionsControl = this.loteForm.get('dimensions');
    const observationControl = this.loteForm.get('observation');
    const plantationControl = this.loteForm.get('plantation');

    const changes = {
      dimensions: dimensionsControl?.value,
      descriptions: observationControl?.value,
      type_crop_id: plantationControl?.value,
    };

    if (
      Object.values(changes).every((value) => value === null || value === '')
    ) {
      this.toastr.info('No se realizaron cambios', 'Información');
      return; // No se realizaron cambios, salir del método
    }

    this.apiService
      .updatePlotOperador(
        this.userId,
        this.FieldId,
        this.currentPlotId,
        changes
      )
      .subscribe(
        () => {
          this.toastr.success('Lote actualizado con éxito', 'Éxito');
          localStorage.removeItem('plotId');
          localStorage.removeItem('plotData');
          localStorage.removeItem('previousPlantation');
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
  cancelar() {
    this.removePloteService.resetPlotData();
    this.router.navigate(['dashboard/lote']);
  }
}
