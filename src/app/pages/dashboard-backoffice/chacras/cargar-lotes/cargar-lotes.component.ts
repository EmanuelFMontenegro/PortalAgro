import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
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
  selector: 'app-cargar-lotes',
  templateUrl: './cargar-lotes.component.html',
})
export class CargarLotesComponent implements OnInit {
  currentPlotId: number | null = null;
  public buttonText: string = 'Cargar Lote';
  ActualPlantationName: string = '';
  AnteriorPlantationName: string = '';
  nombre: string = '';
  apellido: string = '';
  contacto: string | null = null;
  descripcion: string = '';
  dni: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  persona: any = {};
  plantations: any[] = [];
  loteForm: FormGroup;
  FieldId: number;
  filteredPlantations: Observable<any[]> = new Observable<any[]>();
  filtroPlantations = new FormControl('');
  private userId: number | any;
  private personId: number | any;
  public email: string | null = null;

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
    private fb: FormBuilder
  ) {
    this.loteForm = this.fb.group({
      dimensions: ['', [Validators.min(1)]],
      observation: [''],
      plantation: [''],
    });

    const chacraSeleccionada = localStorage.getItem('chacraSeleccionada');
    if (chacraSeleccionada) {
      const chacraSeleccionadaObj = JSON.parse(chacraSeleccionada);
      this.FieldId = chacraSeleccionadaObj.id;
    } else {
      this.FieldId = 0;
    }
  }

  ngOnInit(): void {
    const idPerfilProd = localStorage.getItem('idPerfilProd');
    if (idPerfilProd) {
      this.userId = JSON.parse(idPerfilProd);
    }

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
        plantation: plotData.typeCrop.id.toString(),
        dimensions: plotData.dimensions.toString(),
        observation: plotData.descriptions,
      });

      this.buttonText = 'Actualizar Lote';
    }
    this.DatosUser(this.userId);
  }

  DatosUser(userId: number) {
    this.personId = userId;

    this.apiService.getPersonByIdProductor(userId, this.personId).subscribe(
      (response: DatosUsuario) => {
        if (response) {
          this.nombre = response.name;
          this.apellido = response.lastname;
          this.email = response.username;
          this.contacto = response.telephone;
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
      this.toastr.info('No se relleno el Formulario', 'Información');
      return; // No se realizaron cambios, salir del método
    }

    this.apiService
      .addPlotOperador(this.userId, this.FieldId, changes)
      .subscribe(
        () => {
          this.toastr.success('Lote creado con éxito', 'Éxito');
          this.loteForm.reset();
          this.router.navigate(['dashboard-backoffice/chacras-lote']);
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
          this.router.navigate(['dashboard-backoffice/chacras-lote']);
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
    this.router.navigate(['dashboard-backoffice/chacras-lote']);
  }
}
