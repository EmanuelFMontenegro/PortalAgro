import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router, ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import {
  TipoLabel,
  DataView,
} from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { RemovePlotService } from 'src/app/services/remove-plot.service';
interface CustomJwtPayload {
  userId: number;
  sub: string;
}
interface Cultivo {
  id: number;
  name: string;
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
  selector: 'app-lote',
  templateUrl: './lote.component.html',
})
export class LoteComponent {
  @Output() campoSeleccionadoCambio = new EventEmitter<any>();
  contador: number = 0;
  loteData: Lote[] = []; // Lista actual de lotes (posiblemente filtrada)
  originalLoteData: Lote[] = [];
  mensaje: string = '';
  options: string[] = ['Plantaciones'];
  loteForm: FormGroup;
  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  modoEdicion: boolean = false;
  persona: any = {};
  FieldId: number = 0;
  localidades: any[] = [];
  camposlect: any;
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades = new FormControl('');
  private userId: number | any;
  private personId: number | any;
  public userEmail: string | null = null;
  cultivos: Cultivo[] = [];
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
  campoSeleccionado: any = {};
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
    {
      label: 'previousPlantation',
      field: 'dashboard/cargar-lote',
      tipoLabel: TipoLabel.botonEditarDevolverObjeto,
    },
    {
      label: '',
      field: 'dashboard/chacras',
      tipoLabel: TipoLabel.botonEliminar,
    },
  ];
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private removePlotService: RemovePlotService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.loadDataLote(this.FieldId, this.userId);
    this.loteForm = this.fb.group({
      nombre: ['', Validators.required],
      plantación: ['', Validators.required],
      dimensions: ['', [Validators.required, Validators.min(0)]],
      observation: [''],
    });
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
    this.decodeToken();
    this.cargarDatosDeUsuario();
    this.removePlotService.resetPlotData();
    this.obtenerCultivos();
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

              // Llamar a loadDataLote una vez que userId esté definido correctamente
              if (this.userId !== null) {
                this.loadDataLote(this.FieldId, this.userId);
              }
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
            this.toastr.success('Chacra registrado con éxito', 'Éxito');
            this.loteForm.reset();
            this.router.navigate(['dashboard/geolocalizacion']);
          },
          (error) => {
            console.error('Error al registrar la Chacra:', error);
            if (error.error && error.error.message) {
              this.toastr.error(
                'Ya Existe una Chacra registrado con este nombre.',
                'Atención'
              );
            } else {
              this.toastr.error(
                'Error al registrar la Chacra. Detalles: ' + error.message,
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
      width: '465px',
      data: {
        message: `¿Seguro quieres eliminar el ${lote.name}?`,
        value: lote,
        showCancel: true,
        borderRadius: '16px',
        borderTop: '#F33036',
        borderTitle: '#FB6065',
        cancelBtnColor: '#F33036',
        cancelBtnBorder: '#F33036',
        confirmBtnBackground: '#F33036',
        confirmBtnColor: '#fff',
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
  loadDataLote(FieldId: number, userId: number): void {
    if (userId && FieldId) {
      this.apiService.getPlotsOperador(userId, FieldId).subscribe(
        (response: any) => {
          if (response?.list && response.list.length > 0) {
            const lotsArray: Lote[][] = response.list[0];

            this.loteData = lotsArray.reduce(
              (acc, curr) => acc.concat(curr),
              []
            );
            this.originalLoteData = [...this.loteData];

            if (this.loteData.length > 0) {
              this.apiService.getAllTypeCropOperador().subscribe(
                (typeCrops: any) => {
                  const typeCropsMap = typeCrops.reduce(
                    (acc: any, curr: any) => {
                      acc[curr.id] = curr.name;
                      return acc;
                    },
                    {}
                  );

                  this.loteData.forEach((lote: Lote) => {
                    lote.plant_name = lote.typeCrop ? lote.typeCrop.name : '';
                  });
                },
                (error) => {
                  console.error('Error al cargar los tipos de cultivo:', error);
                }
              );
            } else {
              this.toastr.info(
                'Aún no has agregado ningún lote.',
                'Información'
              );
            }
          } else {
            this.toastr.info('Aún no has agregado ningún lote.', 'Información');
          }
        },
        (error) => {
          console.error('Error al cargar los lotes:', error);
        }
      );
    } else {
      console.warn(
        'El userId o el FieldId son null o undefined, por lo que no se cargan los lotes.'
      );
    }
  }
  cargarLotes() {
    this.removePlotService.resetPlotData();
    this.router.navigate(['dashboard/cargar-lote'], {
      state: { modoEdicion: this.modoEdicion },
    });
  }
  volver() {
    this.router.navigate(['dashboard/chacras']);
  }
  editarLote(lote: Lote): void {
    this.modoEdicion = true;
    localStorage.setItem('plotId', lote.id.toString());
    localStorage.setItem('plotData', JSON.stringify(lote));
    localStorage.setItem('previousPlantation', lote.typeCrop.name);
    this.router.navigate(['dashboard/cargar-lote']);
  }
  clearFilter() {
    this.removePlotService.resetPlotData();
    this.loadDataLote(this.FieldId, this.userId);
  }
  onFilter(filtro: any) {
    switch (filtro.tipo) {
      case 'Buscar por Plantaciones':
        this.filtrarPorPlantacion(filtro.valor);
        break;
    }
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

  filtrarPorPlantacion(cropId: number | null = null) {
    if (!cropId) {
      this.toastr.error('Debe seleccionar un cultivo', 'Error');
      return;
    }

    if (!this.originalLoteData || this.originalLoteData.length === 0) {
      this.toastr.error('No hay lotes disponibles para buscar', 'Error');
      return;
    }

    const lotesFiltrados = this.originalLoteData.filter(
      (lote) => lote.typeCrop?.id === cropId
    );

    if (lotesFiltrados.length > 0) {
      this.processLoteData(lotesFiltrados);
    } else {
      this.toastr.info(
        'No se encontraron lotes para el cultivo seleccionado',
        'Información'
      );
      this.clearLoteData();
    }
  }

  clearLoteData() {
    this.loteData = [];
    this.contador = 3;

    const intervalo = setInterval(() => {
      this.contador--;
      if (this.contador <= 0) {
        clearInterval(intervalo);
        this.clearFilter();
      }
    }, 1000);
  }
}
