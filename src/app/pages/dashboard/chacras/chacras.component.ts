import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { TipoLabel, DataView } from 'src/app/shared/components/miniatura-listado/miniatura.model';
interface CustomJwtPayload {
  userId: number;
  sub: string;
}
interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
  companyId: number;
}


interface Chacra{
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-chacras',
  templateUrl: './chacras.component.html'
})

export class ChacrasComponent implements OnInit {
  searchText: string = '';
  options: string[] = ['Localidad', 'Productor', 'Nombre', 'Hectareas'];
  userLogeed=this.authService.userLogeed;
  currentYear: number = new Date().getFullYear();
  nombre: string = '';
  apellido: string = '';
  descripcion: string = '';
  dniCuit: string = '';
  descriptions: string = '';
  location: number | null = null;
  telephone: string = '';
  nombreCampo: string = '';
  localidad: string = '';
  nombreLocalidad: string = '';
  localidades: any[] = [];
  campos: any[] = [];
  dataView: DataView[] = [
    { label: '', field: 'assets/img/Chacra_1.png', tipoLabel: TipoLabel.imagen },
    { label: '', field: 'name', tipoLabel: TipoLabel.titulo },
    { label: 'Localidad', field: 'address.location.name', tipoLabel: TipoLabel.span },
    { label: 'Hectarias', field: 'dimensions', tipoLabel: TipoLabel.span },
    { label: 'Descripción', field: 'observation', tipoLabel: TipoLabel.span }, 
    { label: 'campoSeleccionado', field: 'dashboard/lote', tipoLabel: TipoLabel.botonVerLote },
    { label: 'campoSeleccionado', field: 'dashboard/detalle-campo', tipoLabel: TipoLabel.botonGeo },

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

  addressTouched = false;
  locationTouched = false;
  nameTouched = false;
  dimensionsTouched = false;
  observationTouched = false;
  campoSeleccionado: any;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.userEmail = this.authService.getUserEmail();
    // this.decodeToken();
    this.campoData.geolocation = '';
    this.cargarCampos();
    this.cargarDatosDeUsuario();
    this.obtenerLocalidades();
  }

  // decodeToken(): void {
  //   const token = this.authService.getToken();
  //   if (token) {
  //     try {
  //       const decoded: any = jwtDecode(token);
  //       this.userId = decoded.userId;
  //       this.userEmail = decoded.sub;
  //       this.companyId = decoded.companyId;
  //     } catch (error) {
  //       console.error('Error al decodificar el token:', error);
  //     }
  //   } else {
  //     this.userId = null;
  //     this.userEmail = null;
  //   }
  // }

  onSearch() {
    // Implement your search logic here
    console.log('Searching for:', this.searchText);
  }

  clearFilters() {
    // Implement your clear filters logic here
    console.log('Clearing filters');
  }

  applyFilters() {
    // Implement your apply filters logic here
    console.log('Applying filters');
  }

  newRanch() {
    // Implement your new ranch logic here
    this.router.navigate(['/dashboard/campo']);
  }


  BtnRegisterCampos(): void {
    this.router.navigate(['/dashboard/campo']);
  }

  cargarCampos() {
    if (!this.userLogeed?.userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    this.apiService.getFields(this.userLogeed?.userId).subscribe(
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
  cargarDatosDeUsuario() {
    // const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');


       console.log("datos del dekoden",this.userLogeed)
      if (this.userLogeed!.userId== null) {
        this.apiService.getLocationMisiones('location').subscribe(
          (localidades) => {
            this.localidades = localidades;

            let nombreLocalidad: string = '';

            this.apiService
              .getPersonByIdProductor(this.userLogeed!.userId, this.userLogeed!.userId)
              .subscribe(
                (data) => {
                  const localidad = this.localidades.find(
                    (loc) => loc.id === data.location.id
                  );
                  this.location = localidad ? localidad.name : null;

                  this.nombreLocalidad = nombreLocalidad;
                  this.nombre = data.name;
                  this.apellido = data.lastname;
                  this.dniCuit = data.dniCuit;
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
          },
          (error) => {
            console.error('Error al obtener las localidades', error);
          }
        );
      }

  }

  geolocalizar() {
    if (this.campoSeleccionado) {
      this.router.navigate(['dashboard/geolocalizacion'], {
        state: { campoSeleccionado: this.campoSeleccionado },
      });
    } else {
      this.toastr.warning('No se ha seleccionado ningún campo', 'Advertencia');
    }
  }

  registrarCampo(): void {
    if (!this.userLogeed?.userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    if (this.isValidForm()) {
      this.apiService.addField(this.userLogeed?.userId, this.campoData).subscribe(
        () => {
          this.toastr.success('Campo registrado con éxito', 'Éxito');
          this.campoData = {
            name: '',
            dimensions: '',
            geolocation: '',
            observation: '',
            address: {
              address: '',
              location: '',
            },
          };
          this.router.navigate(['dashboard/geolocalizacion']);
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
      this.toastr.error(
        'Por favor, completa todos los campos requeridos',
        'Error'
      );
    }
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

  isValidForm(): boolean {
    const dimensions = Number(this.campoData.dimensions);
    const isAddressValid = this.campoData.address.address.trim() !== '';
    const isLocationValid = this.campoData.address.location.trim() !== '';
    const isNameValid = this.campoData.name.trim() !== '';
    const isObservationValid = this.campoData.observation.trim() !== '';
    const areDimensionsValid = !isNaN(dimensions) && dimensions > 0;

    return (
      isAddressValid &&
      isLocationValid &&
      isNameValid &&
      areDimensionsValid &&
      isObservationValid
    );
  }
  volver() {
    this.router.navigate(['dashboard/inicio']);
  }
  verLotes (campo: any): void {
      this.campoSeleccionado = campo;
      localStorage.setItem(
        'campoSeleccionado',
        JSON.stringify(this.campoSeleccionado)
      );
    this.router.navigate(['dashboard/lote']);

  }
  verMas(campo: any): void {
    this.campoSeleccionado = campo;
    localStorage.setItem(
      'campoSeleccionado',
      JSON.stringify(this.campoSeleccionado)
    );

    this.router.navigate(['dashboard/detalle-campo']);
  }

  clearFilter() {
    this.cargarCampos();
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
} 

