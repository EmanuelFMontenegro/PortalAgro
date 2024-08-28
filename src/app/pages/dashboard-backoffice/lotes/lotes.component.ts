import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { MatSelectChange } from '@angular/material/select';
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
import { Router, ActivatedRoute } from '@angular/router';
import {
  TipoLabel,
  DataView,
} from 'src/app/shared/components/miniatura-listado/miniatura.model';
import {
  DashboardBackOfficeService,
  Titulo,
} from '../dashboard-backoffice.service';

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
  styleUrls: ['./lotes.component.sass'],
})
export class LotesComponent implements OnInit {
  titulo: string = 'Lotes';
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
    // IMAGEN
    { label: '', field: 'assets/img/lote_1.svg', tipoLabel: TipoLabel.imagen },

    // SPAN
    { label: 'Nombre del Lote', field: 'name', tipoLabel: TipoLabel.span },
    { label: 'Plantación', field: 'plant_name', tipoLabel: TipoLabel.span },
    { label: 'Hectáreas', field: 'dimensions', tipoLabel: TipoLabel.span },
    { label: 'Descripción', field: 'descriptions', tipoLabel: TipoLabel.span },

    // VER MAS
    {
      label: '',
      field: 'dashboard-backoffice/perfil-productor',
      tipoLabel: TipoLabel.botonVermas,
    },
  ];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
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
    this.decodeToken();
    this.obtenerLocalidades();
    this.obtenerCultivos();
    this.filtrarPorCultivo();
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

  obtenerIdLocalidadSeleccionada(): number | undefined {
    return this.filtroLocalidades.value;
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

  aplicarFiltro(event: MatSelectChange) {
    const valorSeleccionado = event.value;

    switch (valorSeleccionado) {
      case 'localidad':
        this.placeholderText = 'Buscar por localidad';
        this.mostrarMatSelectLocalidades = true;
        break;
      case 'productor':
        this.placeholderText = 'Buscar por productor';
        this.mostrarMatSelectLocalidades = false;
        break;
      case 'cultivo':
        this.placeholderText = 'Seleccionar cultivo';
        this.mostrarMatSelectLocalidades = false;
        break;
      case 'hectareas':
        this.placeholderText = 'Buscar por Hectáreas';
        this.mostrarMatSelectLocalidades = false;
        break;
      default:
        this.placeholderText = '';
        this.mostrarMatSelectLocalidades = false;
        break;
    }
  }

  filtrarPorLocalidad() {
    if (!this.idLocalidadSeleccionada) {
      this.toastr.error('Por favor selecciona una localidad.', 'Error');
      return;
    }

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
        this.idLocalidadSeleccionada
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
    this.apiService.getAllPlotsAdmin().subscribe(
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
  filtrarPorProductor() {
    if (this.nombreProductor) {
      this.apiService
        .getAllPlotsAdmin(
          undefined,
          undefined,
          undefined,
          undefined,
          this.nombreProductor
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

  filtrarPorCultivo() {
    if (this.cropId) {
      this.apiService
        .getAllPlotsAdmin(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          this.cropId
        )
        .subscribe(
          (data: any) => {
            console.log('los que trae el enpoint cultivos', data);
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

  validarMinHectareas() {
    if (this.minHectareas && isNaN(this.minHectareas)) {
      this.toastr.warning(
        'Por favor ingresa un valor numérico válido para el mínimo de hectáreas.',
        'Advertencia'
      );
      this.minHectareas = undefined;
    }
  }

  validarMaxHectareas() {
    if (this.maxHectareas && isNaN(this.maxHectareas)) {
      this.toastr.warning(
        'Por favor ingresa un valor numérico válido para el máximo de hectáreas.',
        'Advertencia'
      );
      this.maxHectareas = undefined;
    }
  }

  aplicarFiltroHectareas(minHectareas: number, maxHectareas: number) {
    if (!minHectareas || !maxHectareas) {
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
        minHectareas.toString(),
        maxHectareas.toString()
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

  volver() {
    this.router.navigate(['dashboard-backoffice/inicio']);
  }

  limpiarTexto() {
    this.Buscar = '';
    this.idLocalidadSeleccionada = undefined;
    this.loteData = [];
    this.nombreProductor = '';
    this.cropId = '';
    this.cargarLotes();
  }

  filtrar() {
    if (!this.filtroSeleccionado) {
      this.toastr.warning('Por favor selecciona un filtro.', 'Advertencia');
      return;
    }

    switch (this.filtroSeleccionado) {
      case 'localidad':
        const localidadId = this.obtenerIdLocalidadSeleccionada();
        // Verifica si localidadId es un número válido antes de realizar la comparación
        if (
          localidadId === null ||
          localidadId === undefined ||
          isNaN(localidadId)
        ) {
          this.toastr.error(
            'Por favor selecciona una localidad válida.',
            'Error'
          );
          return;
        }
        this.filtrarPorLocalidad();
        break;
      case 'productor':
        this.filtrarPorProductor();
        break;
      case 'cultivo':
        this.filtrarPorCultivo();
        break;
      case 'hectareas':
        const minHectareasStr: string = this.minHectareas
          ? this.minHectareas.toString()
          : '';
        const maxHectareasStr: string = this.maxHectareas
          ? this.maxHectareas.toString()
          : '';

        const minHectareasNum = minHectareasStr
          ? parseFloat(minHectareasStr)
          : undefined;
        const maxHectareasNum = maxHectareasStr
          ? parseFloat(maxHectareasStr)
          : undefined;
        if (
          minHectareasNum !== undefined &&
          maxHectareasNum !== undefined &&
          !isNaN(minHectareasNum) &&
          !isNaN(maxHectareasNum)
        ) {
          this.aplicarFiltroHectareas(minHectareasNum, maxHectareasNum);
        } else {
          this.toastr.warning(
            'Por favor ingresa valores numéricos válidos para las hectáreas.',
            'Advertencia'
          );
        }
        break;
      default:
        this.toastr.warning(
          'Por favor selecciona un filtro válido.',
          'Advertencia'
        );
        break;
    }
  }

  BtnNuevaChacra() {
    this.router.navigate(['dashboard-backoffice/inicio']);
  }

  verMas(campo: any) {
    this.router.navigate(['dashboard-backoffice/perfil-productor']);
  }
}
