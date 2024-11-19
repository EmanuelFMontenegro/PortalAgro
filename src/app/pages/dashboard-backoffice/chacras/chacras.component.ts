import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { TipoLabel, DataView } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';
import { selectButtons, selectFilters } from 'src/app/shared/components/dinamic-searchbar/dinamic-searchbar.config';

interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
  companyId: number;
}

@Component({
  selector: 'app-chacras',
  templateUrl: './chacras.component.html',
})
export class ChacrasComponent implements OnInit {  
  public userEmail: string | null = null;
  localidades: any[] = [];
  userLogeed = this.authService.userLogeed;
  campos: any[] = [];
  options: string[] = ['Localidad', 'Productor', 'Nombre', 'Hectareas'];
  dataView: DataView[] = [
    { label: '', field: 'assets/img/Chacra_1.png', tipoLabel: TipoLabel.imagen },
    { label: '', field: 'name', tipoLabel: TipoLabel.titulo },
    { label: 'Localidad', field: 'address.location.name', tipoLabel: TipoLabel.span },
    { label: 'Hectarias', field: 'dimensions', tipoLabel: TipoLabel.span },
    { label: 'Descripción', field: 'observation', tipoLabel: TipoLabel.span },
    { label: 'chacraSeleccionada', field: '/dashboard-backoffice/chacras-lote', tipoLabel: TipoLabel.botonVerLote },
    { label: 'chacraSeleccionada', field: '/dashboard-backoffice/chacras-geolocalizar', tipoLabel: TipoLabel.botonGeo },

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
  filterConfigs: any;
  buttonConfigs: any;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    public dashboardBackOffice: DashboardBackOfficeService) {
    this.dashboardBackOffice.dataTitulo.next({ titulo: `¡Bienvenido!, Acá podrás gestionar, las chacras de los Productores`, subTitulo: '' })

  }

  ngOnInit(): void {
    this.filterConfigs = selectFilters([
      'LOCALIDAD',
      'PRODUCTOR',
      'NOMBRE_CHACRA',
      'HECTAREAS'
    ]);

    this.buttonConfigs = selectButtons([
      'REGISTRAR_CHACRA_P', 
    ]); 
    this.cargarChacras();
    this.obtenerLocalidades();
  }
 


  onFilter(filtro: any) {  
    const filterHandlers: { [key: string]: (value: any) => void } = {
      'Buscar por Localidad': (value) => this.filtrarPorLocalidad(value),
      'Buscar por Productor': (value) => this.filtrarPorProductor(value),
      'Buscar por Nombre de Chacra': (value) => this.filtrarPorNombreDeChacra(value),
      'Buscar por Hectáreas': (value) => this.filtrarPorHectareas(filtro.min , filtro.max),
    };
    const handler = filterHandlers[filtro.type];
    
    if (handler) {
      handler(filtro.value);
    } else {
      console.warn(`No se encontró un manejador para el filtro tipo: ${filtro.type}`);
    }
  }

  

  validarMinHectareas(min: number, max: number) {
    if (min && max && min > max) {
      min = max;
    }
  }

  validarMaxHectareas(min: number, max: number) {
    if (min && max && max < min) {
      max = min;
    }
  }

   

  cargarChacras() {
    this.apiService.getUsersFields(0, 500, 'id', 'desc').subscribe(
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
      },
      (error) => {
        console.error('Error al obtener las localidades', error);
      }
    ); 
  }

  filtrarPorLocalidad(buscar: string) {
    if (!buscar) {
      console.error('Debe seleccionar una localidad');
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
      .getUsersFields(0, 500, 'id', 'desc', true, '', '', locationId)
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

  filtrarPorNombreDeChacra(nombreChacra: string) {
    if (!nombreChacra || nombreChacra.trim() === '') {
      console.error('Debe ingresar un nombre de chacra');
      return;
    }
    this.apiService
      .getUsersFields(0, 500, 'id', 'desc', true, '', nombreChacra)
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

  filtrarPorHectareas(min: number, max: number) {
    if (min === undefined || max === undefined || isNaN(min) || isNaN(max)) {
      console.error('Debe ingresar valores válidos para el rango de hectáreas');
      return;
    }
    this.apiService
      .getUsersFields(
        0,
        500,
        'id',
        'desc',
        true,
        '',
        '',
        null,
        null,
        min,
        max
      ).subscribe(
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

  filtrarPorProductor(nombreProductor: string) {
    // Verificar si se ha ingresado un nombre de productor
    if (!nombreProductor || nombreProductor.trim() === '') {
      console.error('Debe ingresar un nombre de productor');
      return;
    }
    this.apiService
      .getUsersFields(
        0, // pageNo
        500, // pageSize
        'id', // sortBy
        'desc', // sortDir
        true, // isActive
        nombreProductor // producerNames
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
  
  clearFilter() {
    this.cargarChacras();
  }


}
