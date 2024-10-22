import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { TipoLabel, DataView } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';

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
  titulo: string = 'Chacras';
  private userId: number | any;
  public userEmail: string | null = null;
  private companyId: number | any;
  nombre: string = '';
  apellido: string = '';
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
    //ver bien las rutas de ver geo y ver lote , trae siempre el mismo lote
    { label: 'campoSeleccionado', field: '/dashboard-backoffice/chacras-lote', tipoLabel: TipoLabel.botonVerLote },
    { label: 'selectedUser', field: 'url DEL BTN', tipoLabel: TipoLabel.botonGeo },

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
    public dashboardBackOffice: DashboardBackOfficeService) {
    this.dashboardBackOffice.dataTitulo.next({ titulo: `¡Bienvenido!, Acá podrás gestionar, las chacras de los Productores`, subTitulo: '' })

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
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;
      this.companyId = decoded.companyId;
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }

  onFilter(filtro: any) {
    switch (filtro.tipo) {
      case 'Buscar por Localidad':
        this.filtrarPorLocalidad(filtro.valor);
        break;
      case 'Buscar por Productor':
        this.filtrarPorProductor(filtro.valor);
        break;
      case 'Buscar por Nombre de Chacra':
        this.filtrarPorNombreDeChacra(filtro.valor);
        break;
      case 'Buscar por Hectáreas':
        this.filtrarPorHectareas(filtro.min, filtro.max);
        break;
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

  cargarDatosDeUsuario() {
    const token = this.authService.getToken();
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.userId && decoded.companyId) {
        this.userId = decoded.userId;
        this.companyId = decoded.companyId;
        this.userEmail = decoded.sub;
        this.apiService.findUserById(this.companyId, this.userId).subscribe(
          (data) => {
            this.nombre = data.name;
            this.apellido = data.lastname;
          },
          (error) => {
            console.error('Error al obtener el nombre del usuario:', error);
          }
        );
      } else {
        this.userId = null;
        this.userEmail = null;
      }
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
      },
      (error) => {
        console.error('Error al obtener las localidades', error);
      }
    );
    console.log(this.localidades);
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

  filtrarPorNombreDeChacra(nombreChacra: string) {
    if (!nombreChacra || nombreChacra.trim() === '') {
      console.error('Debe ingresar un nombre de chacra');
      return;
    }
    this.apiService
      .getUsersFields(0, 5, 'id', 'desc', true, '', nombreChacra)
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

  filtrarPorHectareas(minHectareas: number, maxHectareas: number) {
    if (minHectareas === undefined || maxHectareas === undefined || isNaN(minHectareas) || isNaN(maxHectareas)) {
      console.error('Debe ingresar valores válidos para el rango de hectáreas');
      return;
    }
    // Convertir las cadenas de texto a números
    const minHectareasNum = minHectareas;
    const maxHectareasNum = maxHectareas;
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
        5, // pageSize
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
