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
import { DialogComponent } from '../dialog/dialog.component';
import { Router, ActivatedRoute } from '@angular/router';

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
  plant_name?: string; // Se agrega la propiedad plant_name como opcional
  type_crop_id?: number; // Se agrega la propiedad type_crop_id como opcional
}

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.sass'],
})
export class LotesComponent implements OnInit {
  mostrarMatSelectLocalidades: boolean = false;
  localidades: any[] = [];
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades: FormControl = new FormControl('');
  Buscar: string = '';
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

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
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
    this.decodeToken();
    this.cargarDatosDeUsuario();
    this.obtenerLocalidades();
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

  cargarDatosDeUsuario() {
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;

      this.companyId = 1;

      if (this.userId !== null && this.companyId !== null) {
        this.apiService.findUserById(this.companyId, this.userId).subscribe(
          (data) => {
            this.nombre = data.name;
            this.apellido = data.lastname;
          },
          (error) => {
            console.error('Error al obtener el nombre del usuario:', error);
          }
        );
      }
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }

  obtenerLocalidades() {
    this.apiService.getLocationMisiones('location').subscribe(
      (localidades) => {
        this.localidades = localidades;
        console.log('localidades de misiones', this.localidades);
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
    console.log('el filtro de localidades', this.filteredLocalidades);
    const filterValue = value.toLowerCase();
    return this.localidades.filter((loc) =>
      loc.name.toLowerCase().includes(filterValue)
    );
  }

  aplicarFiltro(event: MatSelectChange) {
    const valorSeleccionado = event.value;
    console.log('Valor seleccionado:', valorSeleccionado);
    switch (valorSeleccionado) {
      case 'localidad':
        this.placeholderText = 'Buscar por localidad';
        this.mostrarMatSelectLocalidades = true;
        break;
      case 'productor':
        this.placeholderText = 'Buscar por productor';
        this.mostrarMatSelectLocalidades = false;
        this.filtrarPorProductor(); // Llamada al método para filtrar por productor
        break;
      case 'cultivo':
        this.placeholderText = 'Seleccionar cultivo';
        this.mostrarMatSelectLocalidades = false;
        this.filtrarPorCultivo(); // Llamada al método para filtrar por cultivo
        break;
      case 'hectareas':
        this.placeholderText = 'Buscar por Hectáreas';
        this.mostrarMatSelectLocalidades = false;
        this.aplicarFiltroHectareas(event); // Llamada al método para aplicar filtro por hectáreas
        break;
      default:
        this.placeholderText = '';
        this.mostrarMatSelectLocalidades = false;
        break;
    }
  }

  validarMinHectareas() {
    // Validamos que el valor mínimo no sea mayor que el valor máximo
    if (
      this.minHectareas &&
      this.maxHectareas &&
      this.minHectareas > this.maxHectareas
    ) {
      this.minHectareas = this.maxHectareas;
    }
  }

  validarMaxHectareas() {
    // Validamos que el valor máximo no sea menor que el valor mínimo
    if (
      this.minHectareas &&
      this.maxHectareas &&
      this.maxHectareas < this.minHectareas
    ) {
      this.maxHectareas = this.minHectareas;
    }
  }
  aplicarFiltroHectareas(event: MatSelectChange) {

  }

  filtrarPorLocalidad() {}

  filtrarPorProductor() {}

  filtrarPorCultivo() {}

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
            // this.router.navigate(['dashboard/geolocalizacion']);
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
              this.processLoteData(data);
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
            lote.plant_name = ''; // Asignar un valor predeterminado en caso de que typeCrop o su id sean undefined
          }
        });

        this.loteData = data;
      },
      (error) => {
        console.error('Error al cargar los tipos de cultivo:', error);
      }
    );
  }

  cargarLotes() {
    this.apiService.getAllPlotsAdmin().subscribe(
      (data: any) => {
        // Procesar los datos de los lotes aquí
        console.log('Lotes cargados:', data);
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

  // cargarLotes() {
  //   this.router.navigate(['dashboard/cargar-lote'], {
  //     state: { modoEdicion: this.modoEdicion },
  //   });
  // }

  volver() {
    this.router.navigate(['dashboard-backoffice/inicio']);
  }
  // editarLote(lote: Lote): void {
  //   this.modoEdicion = true;
  //   localStorage.setItem('plotId', lote.id.toString());
  //   this.router.navigate(['dashboard/cargar-lote']);
  // }

  limpiarTexto() {
    this.Buscar = '';
  }

  activarFiltro() {
    // Implementa la lógica para activar el filtro aquí
    console.log('Se activó el filtro');
  }

  BtnNuevaChacra() {
    // Lógica para manejar el clic en el botón de registrar campos
  }

  editarLote(lote: any) {}

  verMas(campo: any) {
    // Lógica para ver más detalles sobre un campo específico
  }
}
