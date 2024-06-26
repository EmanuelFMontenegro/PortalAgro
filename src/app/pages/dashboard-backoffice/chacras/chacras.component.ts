import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { MatSelectChange } from '@angular/material/select';
import {
  startWith,
  map,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TipoLabel, DataView } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';

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
  selector: 'app-chacras',
  templateUrl: './chacras.component.html',
  styleUrls: ['./chacras.component.sass'],
})
export class ChacrasComponent implements OnInit {
  titulo: string = 'Chacras';
  Buscar: string = '';
  placeholderText: string = 'Buscar por . . .';
  private userId: number | any;
  public userEmail: string | null = null;
  private companyId: number | any;
  nombre: string = '';
  apellido: string = '';
  campos: any[] = [];
  localidades: any[] = [];
  chacra: any[] = [];
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades: FormControl = new FormControl('');
  mostrarInputNormal: boolean = true;
  minHectareas: number | undefined;
  maxHectareas: number | undefined;
  hectareasOptions: number[] = [];
  hectareasOption: string = 'min-max';
  nombreChacra: string = '';
  nombreProductor: string = '';

  dataView: DataView [] = [

    // IMAGEN
    {label: '', field: 'assets/img/lote_1.svg', tipoLabel: TipoLabel.imagen},

    // TITULO
    {label: '', field: 'name', tipoLabel: TipoLabel.titulo},

    // SPAN
    {label: 'Localidad', field: 'address.location.name', tipoLabel: TipoLabel.span},
    {label: 'Dirección', field:'address.address', tipoLabel: TipoLabel.span },
    {label: 'Hectarias', field:'dimensions', tipoLabel: TipoLabel.span },
    {label: 'Descripción', field: 'observation', tipoLabel: TipoLabel.span},

    // BTN VER MAS
    {label: 'selectedUser', field: 'url DEL BTN', tipoLabel: TipoLabel.botonVermas},

 ]

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
    private router: Router,
    private http: HttpClient,
    public dashboardBackOffice: DashboardBackOfficeService)
   {
    this.dashboardBackOffice.dataTitulo.next({ titulo: `¡Bienvenido!, Acá podrás gestionar, las chacras de los Productores` , subTitulo: ''})
    for (let i = 1; i <= 100; i++) {
      this.hectareasOptions.push(i);
    }
  }

  ngOnInit(): void {
    this.decodeToken();
    this.cargarDatosDeUsuario();
    this.cargarChacras();
    this.obtenerLocalidades();
  }

  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;
    }
  }

  aplicarFiltro(event: MatSelectChange) {
    const filtros: {
      [key: string]: {
        placeholder: string;
        mostrarInputNormal: boolean;
        limpiarInput: boolean;
      };
    } = {
      localidad: {
        placeholder: 'Buscar por Localidad',
        mostrarInputNormal: false,
        limpiarInput: false,
      },
      productor: {
        placeholder: 'Buscar por Productor',
        mostrarInputNormal: true,
        limpiarInput: true,
      },
      nombreChacra: {
        placeholder: 'Buscar por Nombre de Chacra',
        mostrarInputNormal: false,
        limpiarInput: true,
      },
      hectareas: {
        placeholder: 'Buscar por Hectáreas',
        mostrarInputNormal: false,
        limpiarInput: true,
      },
    };

    const filtroSeleccionado = filtros[event.value];
    this.placeholderText = filtroSeleccionado.placeholder;
    this.mostrarInputNormal = filtroSeleccionado.mostrarInputNormal;

    if (filtroSeleccionado.limpiarInput) {
      this.limpiarInputs();
    }
  }

  limpiarInputs() {
    this.nombreProductor = '';
    this.nombreChacra = '';
  }

  validarMinHectareas() {
    if (
      this.minHectareas &&
      this.maxHectareas &&
      this.minHectareas > this.maxHectareas
    ) {
      this.minHectareas = this.maxHectareas;
    }
  }

  validarMaxHectareas() {
    if (
      this.minHectareas &&
      this.maxHectareas &&
      this.maxHectareas < this.minHectareas
    ) {
      this.maxHectareas = this.minHectareas;
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

  cargarChacras() {
    this.apiService.getUsersFields(0, 10, 'id', 'desc').subscribe(
      (response) => {
        if (response.list && response.list.length > 0) {
          this.campos = response.list[0];
        } else {
          console.error('La lista de campos está vacía o no está definida');
        }
      },
      (error) => {
        console.error('Error al obtener campos:', error);
      }
    );
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

  limpiarTexto() {
    this.Buscar = '';
    this.nombreChacra = '';
    this.nombreProductor = '';
    this.minHectareas = undefined;
    this.maxHectareas = undefined;
    this.cargarChacras();
  }

  activarFiltro() {
    switch (this.placeholderText) {
      case 'Buscar por Localidad':
        this.filtrarPorLocalidad();
        break;
      case 'Buscar por Nombre de Chacra':
        setTimeout(() => {
          this.filtrarPorNombreDeChacra();
        });
        break;
      case 'Buscar por Productor':
        setTimeout(() => {
          this.filtrarPorProductor();
        });
        break;
      case 'Buscar por Hectáreas':
        this.filtrarPorHectareas();
        break;
      default:
        console.error('Tipo de filtro no reconocido:', this.placeholderText);
        break;
    }
  }

  filtrarPorLocalidad() {
    if (!this.Buscar) {
      console.error('Debe seleccionar una localidad');
      return;
    }

    const localidadSeleccionada = this.localidades.find(
      (loc) => loc.name === this.Buscar
    );
    if (!localidadSeleccionada) {
      console.error('Localidad no encontrada');
      return;
    }

    const locationId = localidadSeleccionada.id;
    this.apiService
      .getUsersFields(0, 5, 'id', 'desc', true, '', '', locationId)
      .subscribe(
        (response) => {
          if (response.list && response.list.length > 0) {
            this.campos = response.list[0];
          } else {
            this.toastr.info(
              'No existen campos registrados con esta localidad',
              'Información'
            );
            this.campos = [];
          }
        },
        (error) => {
          console.error('Error al obtener campos:', error);
        }
      );
  }

  filtrarPorNombreDeChacra() {
    if (!this.nombreChacra || this.nombreChacra.trim() === '') {
      console.error('Debe ingresar un nombre de chacra');
      return;
    }

    // Llamar al servicio con el nombre de chacra para filtrar
    this.apiService
      .getUsersFields(0, 5, 'id', 'desc', true, '', this.nombreChacra)
      .subscribe(
        (response) => {
          if (response.list && response.list.length > 0) {
            this.campos = response.list[0];
          } else {
            this.toastr.info(
              'No existen campos registrados con este nombre de chacra',
              'Información'
            );
            this.campos = [];
          }
        },
        (error) => {
          console.error('Error al obtener campos:', error);
        }
      );
  }

  filtrarPorHectareas() {
    if (
      this.minHectareas === undefined ||
      this.maxHectareas === undefined ||
      isNaN(this.minHectareas) ||
      isNaN(this.maxHectareas)
    ) {
      console.error('Debe ingresar valores válidos para el rango de hectáreas');
      return;
    }

    // Convertir las cadenas de texto a números
    const minHectareasNum = this.minHectareas;
    const maxHectareasNum = this.maxHectareas;

    // Llamar al servicio con el rango de hectáreas para filtrar
    this.apiService
      .getUsersFields(
        0,
        5,
        'id',
        'desc',
        true,
        '',
        '',
        null,
        null,
        minHectareasNum,
        maxHectareasNum
      )
      .subscribe(
        (response) => {
          if (response.list && response.list.length > 0) {
            this.campos = response.list[0];
          } else {
            this.toastr.info(
              'No existen campos registrados dentro de este rango de hectáreas',
              'Información'
            );
            this.campos = [];
          }
        },
        (error) => {
          console.error('Error al obtener campos:', error);
        }
      );
  }

  filtrarPorProductor() {
    // Verificar si se ha ingresado un nombre de productor
    if (!this.nombreProductor || this.nombreProductor.trim() === '') {
      console.error('Debe ingresar un nombre de productor');
      return;
    }

    // Llamar al servicio con el nombre del productor para filtrar
    this.apiService
      .getUsersFields(
        0, // pageNo
        5, // pageSize
        'id', // sortBy
        'desc', // sortDir
        true, // isActive
        this.nombreProductor // producerNames
        // '', // filedName
        // null, // locationId
        // null, // person_id
        // null, // dimMin
        // null // dimMax
      )
      .subscribe(
        (response) => {
          if (response.list && response.list.length > 0) {
            this.campos = response.list[0];
          } else {
            this.toastr.info(
              'No existen campos registrados con este productor',
              'Información'
            );
            this.campos = [];
          }
        },
        (error) => {
          console.error('Error al obtener campos:', error);
        }
      );
  }

  BtnNuevaChacra() {
    this.router.navigate(['dashboard-backoffice/inicio']);
  }

  verMas(campo: any) {
    // Lógica para ver más detalles sobre un campo específico
  }
}
