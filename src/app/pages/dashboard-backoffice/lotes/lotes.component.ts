import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import {
  TipoLabel,
  DataView,
} from 'src/app/shared/components/miniatura-listado/miniatura.model';
import {
  DashboardBackOfficeService,
  Titulo,
} from '../dashboard-backoffice.service';
import { ButtonConfig, FilterConfig } from 'src/app/models/searchbar.model';
import { selectButtons, selectFilters } from 'src/app/shared/components/dinamic-searchbar/dinamic-searchbar.config';

interface CustomJwtPayload {
  userId: number;
  sub: string;
}

interface Lote {
  id: number;
  name: string;
  dimensions: number;
  descriptions: string;
  active: boolean;
  typeCrop: {
    id: number;
    name: string;
  };
  url_profile: string | null;
  plant_name?: string;
  type_crop_id?: number;
}
interface Cultivo {
  id: number;
  name: string;
}
@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
})
export class LotesComponent implements OnInit {
  options: string[] = ['Localidad', 'Productor', 'Cultivos', 'Hectareas'];
  titulo: string = 'Lotes';
  filterConfigs: FilterConfig[] = [];
  buttonConfigs: ButtonConfig[] = [];
  mostrarMatSelectLocalidades: boolean = false;
  localidades: any[] = [];
  cropId: string | undefined;
  cultivos: Cultivo[] = [];
  idLocalidadSeleccionada: number | undefined;
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades: FormControl = new FormControl('');
  Buscar: string = '';
  nombreProductor: string = '';
  filtroSeleccionado: string = '';
  placeholderText: string = 'Buscar por . . .';
  private userId: number | any;
  public userEmail: string | null = null;
  private companyId: number | any;
  nombre: string = '';
  apellido: string = '';
  campos: any[] = [];
  loteForm: FormGroup;
  FieldId: number = 0;
  loteData: Lote[] = [];
  dimMin: string = '';
  dimMax: string = '';
  minHectareas: number | undefined;
  maxHectareas: number | undefined;
  hectareasOptions: number[] = [];
  hectareasOption: string = 'min-max';
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

  dataView: DataView[] = [
    {
      label: '',
      field: 'assets/img/Chacra_1.png',
      tipoLabel: TipoLabel.imagen,
    },
    { label: 'Nombre del Lote', field: 'name', tipoLabel: TipoLabel.span },
    { label: 'Plantación', field: 'plant_name', tipoLabel: TipoLabel.span },
    { label: 'Hectáreas', field: 'dimensions', tipoLabel: TipoLabel.span },
    { label: 'Descripción', field: 'descriptions', tipoLabel: TipoLabel.span },
 /*    {
      label: '',
      field: 'dashboard-backoffice/perfil-productor',
      tipoLabel: TipoLabel.botonVermas,
    }, */
  ];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dashboardBackOffice: DashboardBackOfficeService
  ) {
    this.loteForm = this.fb.group({
      nombre: ['', Validators.required],
      plantación: ['', Validators.required],
      dimensions: ['', [Validators.required, Validators.min(0)]],
      observation: [''],
    });
    this.dimMin = '';
    this.dimMax = '';

    let data: Titulo = {
      titulo:
        '¡Bienvenido!, Acá podrás gestionar, los lotes de los Productores!',
      subTitulo: '',
    };
    this.dashboardBackOffice.dataTitulo.next(data);
  }

  ngOnInit(): void {
    this.filterConfigs = selectFilters([
      'LOCALIDAD',
      'PRODUCTOR',
      'CULTIVO',
      'HECTAREAS'
    ]);

    this.buttonConfigs = selectButtons([
      'NUEVO_LOTE_P', 
    ]);
   
    this.decodeToken();
    this.obtenerLocalidades();
    this.obtenerCultivos(); /*
    this.filtrarPorCultivo(); */
    this.cargarLotes();
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
          map((value: string) => this.filtrarLocalidades(value || ''))
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

  obtenerCultivos() {
    this.apiService.getAllTypeCropOperador().subscribe(
      (typeCrops: any) => {
        this.cultivos = typeCrops.map((crop: any) => ({
          id: crop.id,
          name: crop.name,
        })); 
      },
      (error) => {
        console.error('Error al cargar los tipos de cultivo:', error);
      }
    );
  }

  filtrarPorLocalidad(buscar: string) { 
    if (!buscar) {
      this.toastr.error('Por favor selecciona una localidad.', 'Error');
      return;
    }
    const localidadSeleccionada = this.localidades.find(
      (loc) => loc.name === buscar
    );
    if (!localidadSeleccionada) {
      console.error('Localidad no encontrada');
      return;
    }
    const locationId = localidadSeleccionada.id;

    this.apiService
      .getAllPlotsAdmin(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        locationId
      )
      .subscribe(
        (data: any) => {
          if (data && data.list && data.list.length > 0) {
            const lotsArray: Lote[][] = data.list[0];
            const lotes: Lote[] = lotsArray.reduce(
              (acc, curr) => acc.concat(curr),
              []
            );
            this.processLoteData(lotes);
          } else {
            this.loteData = [];
            this.toastr.info('Aún no se han agregado lotes.', 'Información');
          }
        },
        (error) => {
          console.error('Error al cargar los lotes:', error);
          this.toastr.error('Error al cargar los lotes');
        }
      );
  }

  cargarLotes() {
    this.apiService.getAllPlotsAdmin(500).subscribe(
      (data: any) => {
        if (data && data.list && data.list.length > 0) {
          const lotsArray: Lote[][] = data.list[0];
          const lotes: Lote[] = lotsArray.reduce(
            (acc, curr) => acc.concat(curr),
            []
          );
          this.processLoteData(lotes);
        } else {
          this.toastr.info('Aún no se han agregado lotes.', 'Información');
        }
      },
      (error) => {
        console.error('Error al cargar los lotes:', error);
        this.toastr.error('Error al cargar los lotes');
      }
    );
  }
  processLoteData(data: Lote[]): void {
    this.apiService.getAllTypeCropOperador().subscribe(
      (typeCrops: any) => {
        const typeCropsMap = typeCrops.reduce((acc: any, curr: any) => {
          acc[curr.id] = curr.name;
          return acc;
        }, {});

        data.forEach((lote: Lote) => {
          if (lote.typeCrop && lote.typeCrop.id !== undefined) {
            lote.plant_name = typeCropsMap[lote.typeCrop.id] || '';
          } else {
            lote.plant_name = '';
          }
        });

        this.loteData = data;
      },
      (error) => {
        console.error('Error al cargar los tipos de cultivo:', error);
      }
    );
  }
  filtrarPorProductor(nombreProductor: string) {
    if (nombreProductor) {
      this.apiService
        .getAllPlotsAdmin(
          undefined,
          undefined,
          undefined,
          undefined,
          nombreProductor
        )
        .subscribe(
          (data: any) => {
            if (data && data.list && data.list.length > 0) {
              const lotsArray: Lote[][] = data.list[0];
              const lotes: Lote[] = lotsArray.reduce(
                (acc, curr) => acc.concat(curr),
                []
              );
              this.processLoteData(lotes);
            } else {
              this.toastr.info(
                'No se encontraron lotes para el productor especificado.',
                'Información'
              );
              this.loteData = [];
            }
          },
          (error) => {
            console.error('Error al filtrar los lotes por productor:', error);
            this.toastr.error('Error al filtrar los lotes por productor');
          }
        );
    }
  }

  filtrarPorCultivo(cropId: string | undefined = undefined) {
    if (cropId) {
      this.apiService
        .getAllPlotsAdmin(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          cropId
        )
        .subscribe(
          (data: any) => {
            if (data && data.list && data.list.length > 0) {
              const lotsArray: Lote[][] = data.list[0];
              const lotes: Lote[] = lotsArray.reduce(
                (acc, curr) => acc.concat(curr),
                []
              );
              this.processLoteData(lotes);
            } else {
              this.toastr.info(
                'No se encontraron lotes para el cultivo buscado.',
                'Información'
              );
              this.loteData = [];
            }
          },
          (error) => {
            console.error('Error al filtrar los lotes por cultivo:', error);
            this.toastr.error('Error al filtrar los lotes por cultivo');
          }
        );
    }
  }

  aplicarFiltroHectareas(min: number, max:number) { 
     if (!min || !max) {
      this.toastr.warning(
        'Por favor ingresa los valores mínimo y máximo de hectáreas.',
        'Advertencia'
      );
      return;
    }  

    this.apiService
      .getAllPlotsAdmin(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        min.toString(),
        max.toString()
      )
      .subscribe(
        (data: any) => {
          if (data && data.list && data.list.length > 0) {
            const lotsArray: Lote[][] = data.list[0];
            const lotes: Lote[] = lotsArray.reduce(
              (acc, curr) => acc.concat(curr),
              []
            );
            this.processLoteData(lotes);
          } else {
            this.toastr.info(
              'No se encontraron lotes dentro del rango de hectáreas especificado.',
              'Información'
            );
            this.loteData = [];
          }
        },
        (error) => {
          console.error(
            'Error al filtrar los lotes por rango de hectáreas:',
            error
          );
          this.toastr.error(
            'El valor mínimo de hectáreas no puede ser mayor que el valor máximo.',
            'Error al intentar filtrar'
          );
        }
      );
  }

  registrarLote(): void {
    if (!this.userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    if (this.loteForm.valid) {
      const nameControl = this.loteForm.get('name');
      const dimensionsControl = this.loteForm.get('dimensions');
      const addressControl = this.loteForm.get('address');
      const localidadControl = this.loteForm.get('localidad');
      const observationControl = this.loteForm.get('observation');

      if (
        nameControl &&
        dimensionsControl &&
        addressControl &&
        localidadControl &&
        observationControl
      ) {
        const fixedGeolocation = "10°38'26'' - 10°38'26''";
        const campoData: any = {
          name: nameControl.value,
          dimensions: dimensionsControl.value,
          geolocation: fixedGeolocation,
          address: {
            address: this.loteForm.get('address')?.value,
            location_id: this.loteForm.get('localidad')?.value,
          },
          observation: observationControl?.value,
        };

        this.apiService.addField(this.userId, campoData).subscribe(
          () => {
            this.toastr.success('Campo registrado con éxito', 'Éxito');
            this.loteForm.reset();
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
        console.error(
          'Error: Al menos uno de los controles del formulario es nulo.'
        );
      }
    } else {
      this.toastr.error(
        'Por favor, completa todos los campos requeridos',
        'Error'
      );
    }
  }

  confirmarBorrado(lote: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        message: `¿Estás seguro que quieres eliminar el lote ${lote.name}?`,
        value: lote,
        showCancel: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService
          .deleteLogicalPlotOperador(this.userId, this.FieldId, lote.id)
          .subscribe(
            () => {
              this.toastr.success('El Lote ha sido borrado con éxito', 'Éxito');
              // Eliminar el lote de la lista
              this.loteData = this.loteData.filter(
                (item) => item.id !== lote.id
              );
            },
            (error) => {
              this.toastr.error('Error al borrar el lote', 'Error');
            }
          );
      }
    });
  }

  clearFilter() {
    this.cargarLotes();
  }

  onFilter(filtro: any) {  
    const filterHandlers: { [key: string]: (value: any) => void } = {
      'Buscar por Localidad': (value) => this.filtrarPorLocalidad(value),
      'Buscar por Productor': (value) => this.filtrarPorProductor(value),
      'Buscar por Cultivo': (value) => this.filtrarPorCultivo(value),
      'Buscar por Hectáreas': (value) => this.aplicarFiltroHectareas(filtro.min , filtro.max),
    };
    const handler = filterHandlers[filtro.type];
    
    if (handler) {
      handler(filtro.value);
    } else {
      console.warn(`No se encontró un manejador para el filtro tipo: ${filtro.type}`);
    }
  }

 
}
