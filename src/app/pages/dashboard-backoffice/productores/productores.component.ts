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
import {
  TipoLabel,
  DataView,
} from 'src/app/shared/components/miniatura-listado/miniatura.model';


interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
  companyId: number;
}

@Component({
  selector: 'app-productores',
  templateUrl: './productores.component.html',
})
export class ProductoresComponent implements OnInit {
  options: string[] = ['NombreProductor', 'ApellidoProductor', 'Localidad'];
  Buscar: string = '';
  usuarios: {
    nombre: string;
    apellido: string;
    localidad: string;
    dni: number;
    email: string;
  }[] = [];
  nombre: string = '';
  apellido: string = '';
  name: string | null = null; 
  location_id: string | null = null; 
  localidades: any[] = []; 
  private userId: number | any;
  public email: string | null = null;
  private companyId: number | any;
  dataView: DataView[] = [
    {label: '', field: 'assets/img/avatar_prod.svg', tipoLabel: TipoLabel.imagen},
    { label: 'Nombre', field: 'nombre', tipoLabel: TipoLabel.span },
    { label: 'Apellido', field: 'apellido', tipoLabel: TipoLabel.span },
    { label: 'Localidad', field: 'localidad', tipoLabel: TipoLabel.span },
    { label: 'Descripcion', field: 'descripcion', tipoLabel: TipoLabel.span },
    { label: 'selectedUser', field: 'dashboard-backoffice/perfil-productor', tipoLabel: TipoLabel.botonVermas },
  ];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    public dashboardBackOffice: DashboardBackOfficeService
  ) {
    this.dashboardBackOffice.dataTitulo.next({
      titulo: `¡Bienvenido!, Acá podrás gestionar, los usuarios de los Productores`,
      subTitulo: '',
    });
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
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
      this.name = decoded.name;
      this.email = decoded.sub;
      this.companyId = decoded.companyId;
    } else {
      this.userId = null;
      this.email = null;
    }
  }

  cargarDatosDeUsuario() {
    const token = this.authService.getToken();
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.userId && decoded.companyId) {
        this.userId = decoded.userId;
        this.companyId = decoded.companyId;
        this.email = decoded.sub;
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
        this.email = null;
      }
    }
  }

  cargarUsuarios(locationId?: number) {
    this.apiService.getPeopleAdmin(locationId).subscribe(
      (data: any) => {
        if (data.list && data.list.length > 0) {
          const usuariosList = data.list.flat();
          this.usuarios = usuariosList.map((usuario: any) => ({
            id: usuario.id,
            nombre: usuario.name,
            apellido: usuario.lastname,
            dni: usuario.dni,
            email: usuario.userEmail,
            telefono: usuario.telephone,
            localidad: usuario.location.name,
            descripcion: usuario.descriptions,
          }));
        }
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
        this.toastr.error('Error al cargar usuarios', 'Error');
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

  onFilter(filtro: any) {
    switch (filtro.tipo) {
      case 'Buscar por Localidad':
        this.filtrarPorLocalidad(filtro.valor);
        break;
      case 'Buscar por Nombre':
        this.filtrarPorNombreOApellido(filtro.valor);
        break;
      case 'Buscar por Apellido':
        this.filtrarPorNombreOApellido(filtro.valor);
        break;
    }
  }

  filtrarPorLocalidad(buscar: string) {
    if (!buscar) {
      return;
    }
    const localidadSeleccionada = this.localidades.find(
      (loc) => loc.name === buscar
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

  filtrarPorNombreOApellido(nombre? : string, apellido? : string) {
    if (!nombre && !apellido) {
      return;
    }
    const filter = {
      anyNames: nombre || apellido || '',
    };

    this.apiService.getPeopleUserAdmin(filter).subscribe(
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
  clearFilter(){
    this.cargarUsuarios();

  }
}
