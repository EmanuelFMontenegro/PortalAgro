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
import { switchMap } from 'rxjs/operators';
import { DialogComponent } from 'src/app/pages/dashboard/dialog/dialog.component';
import {
  TipoLabel,
  DataView,
} from 'src/app/shared/components/miniatura-listado/miniatura.model';
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
  selector: 'app-chacras-lote',
  templateUrl: './chacras-lote.component.html',
})
export class ChacrasLoteComponent {
  @Output() chacraSeleccionadoCambio = new EventEmitter<any>(); 
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
  loteData: Lote[] = [];
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades = new FormControl('');
  email: string | null = null;
  contacto: string | null = null;
  private userId: number = 0;
  private personId: number | any;
  public userEmail: string | null = null;
  options: string[] = ['Localidad', 'Productor', 'Cultivos', 'Hectareas'];
  chacraData = {
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
  chacraSeleccionado: any = {};
  dataView: DataView[] = [
    { label: '', field: 'assets/img/Chacra_1.png', tipoLabel: TipoLabel.imagen },
    { label: 'Nombre del Lote', field: 'name', tipoLabel: TipoLabel.span },
    { label: 'Plantación', field: 'plant_name', tipoLabel: TipoLabel.span },
    { label: 'Hectáreas', field: 'dimensions', tipoLabel: TipoLabel.span },
    { label: 'Descripción', field: 'descriptions', tipoLabel: TipoLabel.span },
    {
      label: 'previousPlantation',
      field: 'dashboard-backoffice/cargar-lotes',
      tipoLabel: TipoLabel.botonEditar,
    },
    {
      label: '',
      field: '',
      tipoLabel: TipoLabel.botonEliminar,
    }
  ];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.loteForm = this.fb.group({
      nombre: ['', Validators.required],
      plantación: ['', Validators.required],
      dimensions: ['', [Validators.required, Validators.min(0)]],
      observation: [''],
    });
  }

  ngOnInit(): void {
    const perfilDataChacra = localStorage.getItem('idPerfilProd');
    if (perfilDataChacra) {
      const userId = parseInt(perfilDataChacra);
      this.personId = userId;
      this.DatosUser(userId, this.personId);
    }
    const userId = localStorage.getItem('idPerfilProd');
    const chacraSeleccionadaString = localStorage.getItem('chacraSeleccionada');

    if (chacraSeleccionadaString !== null) {
      const chacraSeleccionada = JSON.parse(chacraSeleccionadaString);
      this.FieldId = chacraSeleccionada.id;
    } else {
      console.error(
        'No se encontró la chacra seleccionada en el localStorage.'
      );
    }

    this.userId = userId ? parseInt(userId, 10) : 0;
    this.cargarDatosDeUsuario();
    this.loadDataLote(this.FieldId, this.userId);
  }

  ngOnChanges(): void {
    this.loadDataLote(this.FieldId, this.userId);
  }

  cargarDatosDeUsuario() {
    this.personId = this.userId;
    if (this.userId !== 0 && this.personId !== null) {
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

            if (this.userId !== 0) {
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
  }
  DatosUser(userId: number, personId: number) {
    this.apiService.getPersonByIdProductor(userId, personId).subscribe(
      (response: DatosUsuario) => {
        // Verificar si la respuesta contiene datos
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
        const chacraData: any = {
          name: nameControl.value,
          dimensions: dimensionsControl.value,
          geolocation: fixedGeolocation,
          address: {
            address: this.loteForm.get('address')?.value,
            location_id: this.loteForm.get('localidad')?.value,
          },
          observation: observationControl?.value,
        };

        this.apiService.addField(this.userId, chacraData).subscribe(
          () => {
            this.toastr.success('chacra registrado con éxito', 'Éxito');
            this.loteForm.reset();
            this.router.navigate(['dashboard-backoffice/datalle-chacra']);
          },
          (error) => {
            console.error('Error al registrar el chacra:', error);
            if (error.error && error.error.message) {
              this.toastr.error(
                'Ya Existe un chacra registrado con este nombre.',
                'Atención'
              );
            } else {
              this.toastr.error(
                'Error al registrar el chacra. Detalles: ' + error.message,
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
        'Por favor, completa todos los chacras requeridos',
        'Error'
      );
    }
  }
  btnEliminar(e : any){
    console.log(e)
    this.confirmarBorrado(e);
    
  }
  confirmarBorrado(lote: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        message: `¿Estás seguro que quieres eliminar el ${lote.name}?`,
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
            const data: Lote[] = lotsArray.reduce(
              (acc, curr) => acc.concat(curr),
              []
            );

            if (data.length > 0) {
              this.apiService.getAllTypeCropOperador().subscribe(
                (typeCrops: any) => {
                  const typeCropsMap = typeCrops.reduce(
                    (acc: any, curr: any) => {
                      acc[curr.id] = curr.name;
                      return acc;
                    },
                    {}
                  );

                  data.forEach((lote: Lote) => {
                    lote.plant_name = lote.typeCrop ? lote.typeCrop.name : '';
                  });

                  this.loteData = data;
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
    this.router.navigate(['dashboard-backoffice/cargar-lotes']);
  }

  volver() {
    this.router.navigate(['dashboard-backoffice/detalle-chacra']).then(() => {
      this.loadDataLote(this.FieldId, this.userId);
    });
  }

  editarLote(lote: Lote): void {
    this.modoEdicion = true;
    localStorage.setItem('plotId', lote.id.toString());
    localStorage.setItem('plotData', JSON.stringify(lote));
    localStorage.setItem('previousPlantation', lote.typeCrop.name);
    this.router.navigate(['dashboard-backoffice/cargar-lotes']);
  }

 
  clearFilter() {
    this.cargarLotes();
  }

  onFilter(filtro: any) {
    /* switch (filtro.tipo) {
      case 'Buscar por Localidad':
        this.filtrarPorLocalidad(filtro.valor);
        break;
      case 'Buscar por Productor':
        this.filtrarPorProductor(filtro.valor);
        break;
      case 'Buscar por Cultivos':
        this.filtrarPorCultivo(filtro.valor);
        break;
      case 'Buscar por Hectáreas':
        this.aplicarFiltroHectareas(filtro.min, filtro.max);
        break;
    }*/
  } 
}
