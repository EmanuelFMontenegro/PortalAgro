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
import { debounceTime } from 'rxjs/operators';
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
  usuarios: { nombre: string; apellido: string; localidad: string }[] = [];
  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  descriptions: string = '';
  location_id: string | null = null;
  telephone: string = '';
  localidades: any[] = [];
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades: FormControl = new FormControl('');
  private userId: number | any;
  public userEmail: string | null = null;
  private companyId: number | any;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.decodeToken();
    this.cargarDatosDeUsuario();
    this.cargarUsuarios();
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

  cargarUsuarios(locationId?: number) {
    this.apiService.getPeopleAdmin(locationId).subscribe(
      (data: any) => {
        if (data.list && data.list.length > 0) {
          const usuariosList = data.list.flat();
          this.usuarios = usuariosList.map((usuario: any) => ({
            nombre: usuario.name,
            apellido: usuario.lastname,
            localidad: usuario.location.name,
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

    // Aplicar un tiempo de espera usando debounceTime para limitar la frecuencia de llamadas a la API
    this.apiService
      .getPeopleUserAdmin(filter)
      .pipe(
        debounceTime(500) // Esperar 500 milisegundos (0.5 segundos) antes de realizar la llamada a la API
      )
      .subscribe(
        (data: any) => {
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
        localidad: usuario.location ? usuario.location.name : '',
      }));
    } else {
      this.usuarios = []; // Limpiar la lista de usuarios
    }
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
  BtnNuevaChacra() {
    this.router.navigate(['/dashboard-backoffice/perfil-prodcutor']);
  }
  //Agregar en Ver Mas el link o ruta a la pantalla editar un Productores
  verMas() {
    this.router.navigate(['/dashboard-backoffice/inicio']);
  }
}
