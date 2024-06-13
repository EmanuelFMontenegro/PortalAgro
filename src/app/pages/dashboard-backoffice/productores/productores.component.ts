import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';
import { TipoLabel, DataView } from 'src/app/shared/components/miniatura-listado/miniatura.model';

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
  selector: 'app-productores',
  templateUrl: './productores.component.html',
  styleUrls: ['./productores.component.sass'],
})
export class ProductoresComponent implements OnInit {
  mostrarMatSelectLocalidades: boolean = false;
  Buscar: string = '';
  nombreABuscar: string = '';
  apellidoABuscar: string = '';
  placeholderText: string = 'Buscar por . . .';
  usuarios: { nombre: string; apellido: string; localidad: string,dni:number,email:string }[] = [];
  nombre: string = '';
  apellido: string = '';
  name:string | null=null;
  dni: string = '';
  descriptions: string = '';
  location_id: string | null = null;
  telephone: string = '';
  localidades: any[] = [];
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades: FormControl = new FormControl('');
  private userId: number | any;
  public email: string | null = null;
  private companyId: number | any;

  dataView: DataView [] = [

    // IMAGEN
    {label: '', field: 'assets/img/avatar_prod.svg', tipoLabel: TipoLabel.imagen},

    // SPAN
    {label: 'Nombre', field: 'nombre', tipoLabel: TipoLabel.span},
    {label: 'Apellido', field:'apellido', tipoLabel: TipoLabel.span },
    {label: 'Localidad', field:'localidad', tipoLabel: TipoLabel.span },

    // VER MAS
     // en lable va la key para guardar en localstorage y en field la url del btn mas
    {label: 'selectedUser', field: 'dashboard-backoffice/perfil-productor', tipoLabel: TipoLabel.botonVermas},
 ]


  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient,
    public dashboardBackOffice: DashboardBackOfficeService
  ) {
    this.dashboardBackOffice.dataTitulo.next({ titulo: `¡Bienvenido!, Acá podrás gestionar, los usuarios de los Productores` , subTitulo: ''})
  }
  ngOnInit(): void {
    this.decodeToken();
    this.cargarDatosDeUsuario();
    this.cargarUsuarios();
    this.obtenerLocalidades();
  }

  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token); // Adjust this type if necessary

      // Extract user ID and email from decoded token
      this.userId = decoded.userId;
      this.name= decoded.name;
      this.email = decoded.sub;

         } else {
      this.userId = null;
      this.email = null;
    }
  }

  cargarDatosDeUsuario() {
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.email = decoded.sub;

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
      this.email = null;
    }
  }

  cargarUsuarios(locationId?: number) {
    this.apiService.getPeopleAdmin(locationId).subscribe(
      (data: any) => {

        if (data.list && data.list.length > 0) {
          const usuariosList = data.list.flat();
          this.usuarios = usuariosList.map((usuario: any) => ({
            id:usuario.id,
            nombre: usuario.name,
            apellido: usuario.lastname,
            dni:usuario.dni,
            email:usuario.userEmail,
            telefono:usuario.telephone,
            localidad: usuario.location.name,
            descripcion:usuario.descriptions

          }));
        }


      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
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



  aplicarFiltro(event: MatSelectChange) {
    const valorSeleccionado = event.value;

    switch (valorSeleccionado) {
      case 'nombre':
        this.placeholderText = 'Buscar por nombre';
        this.mostrarMatSelectLocalidades = false;
        this.filtrarPorNombreOApellido();
        break;
      case 'apellido':
        this.placeholderText = 'Buscar por apellido';
        this.mostrarMatSelectLocalidades = false;
        this.filtrarPorNombreOApellido();
        break;
      case 'localidad':
        this.placeholderText = 'Buscar por localidad';
        this.mostrarMatSelectLocalidades = true;
        break;
      default:
        this.placeholderText = '';
        this.mostrarMatSelectLocalidades = false;
        break;
    }
  }

  filtrarPorLocalidad() {
    if (!this.Buscar) {
      return;
    }
    const localidadSeleccionada = this.localidades.find(
      (loc) => loc.name === this.Buscar
    );
    if (!localidadSeleccionada) {
      return;
    }
    const locationId = localidadSeleccionada.id;
    this.apiService.getPeopleAdmin(locationId).subscribe(
      (data: any) => {
        if (data.list && data.list.length > 0) {
          const usuariosList = data.list.flat();
          this.usuarios = usuariosList.map((usuario: any) => ({
            nombre: usuario.name || '',
            apellido: usuario.lastname || '',
            localidad: localidadSeleccionada.name,
          }));

          if (this.usuarios.length === 0) {
            this.toastr.info('No existen productores para esta localidad.');
          }
        } else {
          // Limpiar la lista de usuarios
          this.usuarios = [];
        }
      },
      (error) => {
        console.error(
          'Error al obtener los usuarios filtrados por localidad:',
          error
        );
      }
    );
  }

  filtrarPorNombreOApellido() {
    if (!this.nombreABuscar && !this.apellidoABuscar) {
      return;
    }

    const filter = {
      anyNames: this.nombreABuscar || this.apellidoABuscar || '',
    };

    this.apiService.getPeopleUserAdmin(filter).subscribe(
      (data: any) => {
        console.log("datos de filtro",data)
        this.procesarDatosUsuarios(data);
        if (this.usuarios.length === 0) {
          this.toastr.info(
            'No se encontraron productores con el nombre o apellido especificado.'
          );
        }
      },
      (error) => {
        console.error('Error al obtener usuarios filtrados:', error);
      }
    );
  }

  procesarDatosUsuarios(data: any) {
    if (data && data.list && data.list.length > 0) {
      const usuariosList = data.list.flat();
      this.usuarios = usuariosList.map((usuario: any) => ({
        nombre: usuario.name || '',
        apellido: usuario.lastname || '',
        localidad: this.obtenerNombreLocalidad(usuario.location_id), // Convertir ID de localidad en su nombre
      }));
    } else {
      this.usuarios = []; // Limpiar la lista de usuarios
    }
  }

  obtenerNombreLocalidad(locationId: number) {
    // Buscar la localidad correspondiente al ID proporcionado
    const localidad = this.localidades.find((loc) => loc.id === locationId);
    return localidad ? localidad.name : ''; // Devolver el nombre de la localidad si se encuentra, de lo contrario, cadena vacía
  }







  limpiarTexto() {
    this.Buscar = '';
    this.nombreABuscar = '';
    this.apellidoABuscar = '';

    this.cargarUsuarios();
  }

  activarFiltro() {
    if (
      !this.mostrarMatSelectLocalidades &&
      (this.nombreABuscar || this.apellidoABuscar)
    ) {
      this.filtrarPorNombreOApellido();
    } else if (this.mostrarMatSelectLocalidades && !this.Buscar) {
    } else {
      if (this.mostrarMatSelectLocalidades) {
        this.filtrarPorLocalidad();
      } else {
        this.filtrarPorNombreOApellido();
      }
    }
  }
  //Agregar en Ver Mas el link o ruta a la pantalla agregar nuevos Productores
  BtnNuevoUsuario() {
    this.router.navigate(['dashboard-backoffice/nuevo-usuario']);
  }
  //Agregar en Ver Mas el link o ruta a la pantalla editar un Productor
  verMas(usuarios: any) {

    // Guardar los datos del usuario en localStorage
    localStorage.setItem('selectedUser', JSON.stringify(usuarios));
    // Navegar al componente perfil-productor
    this.router.navigate(['dashboard-backoffice/perfil-productor']);
  }
}
