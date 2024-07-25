import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardBackOfficeService } from '../../dashboard-backoffice.service';
import {
  TipoLabel,
  DataView,
} from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { ApiService } from 'src/app/services/ApiService';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { JsonPipe } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
interface User {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  departmentAssigned: Department[];
  account_active: boolean;
  company: Company;
  typeUser: string;
  provinciasAsignadas?: string;
  departamentosAsignados?: string;
  color?: string;
}

interface Company {
  id: number;
  name: string;
  descriptions: string | null;
  provinces: Province[];
}

interface Province {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  province_id: string; // Ajusta según la estructura real
}

interface ExtendedDataView extends DataView {
  customPipe?: string;
  value?: string;
  color?: string; // Ensure 'value' property is defined
}

@Component({
  selector: 'app-usuarios-filtro',
  templateUrl: './usuarios-filtro.component.html',
  styleUrls: ['./usuarios-filtro.component.sass'],
})
export class UsuariosFiltroComponent implements OnInit {
  titulo: string = 'Usuarios';
  usuarios: User[] = [];
  usuariosGenerales: User[] = [];
  length = 0;
  pageSize = 12;
  pageIndex = 0;
  pageSizeOptions = [6, 12, 24];
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;

  userFilterOptions = [
    { value: 'gerenteGeneral', label: 'Gerente General' },
    { value: 'tecnicoGeneral', label: 'Técnico General' },
    { value: 'tecnico', label: 'Técnico' },
    { value: 'piloto', label: 'Piloto' },
    { value: 'cooperativa', label: 'Cooperativa' },
  ];

  public dataView: ExtendedDataView[] = [
    // **IMAGEN (ejemplo estático)
    {
      label: '',
      field: 'assets/img/avatar_prod.svg',
      tipoLabel: TipoLabel.imagen,
    },

    // **SPAN
    { label: 'Nombre', field: 'name', tipoLabel: TipoLabel.span },
    { label: 'Apellido', field: 'lastname', tipoLabel: TipoLabel.span },
    { label: 'DNI', field: 'dni', tipoLabel: TipoLabel.span },
    { label: 'Tipo de Usuario', field: 'typeUser', tipoLabel: TipoLabel.span },

    // **COMPAÑIA
    { label: 'Empresa', field: 'company.name', tipoLabel: TipoLabel.span },

    // **PROVINCIAS
    {
      label: 'Provincias',
      field: 'provinciasAsignadas',
      tipoLabel: TipoLabel.span,
      value: '',
    },

    // **DEPARTAMENOS
    {
      label: 'Departamentos',
      field: 'departamentosAsignados',
      tipoLabel: TipoLabel.span,
      value: '',
    },

    // **BTN EDITAR PEFIL
    {
      label: 'UserType',
      field: 'dashboard-backoffice/usuarios-actualizar',
      tipoLabel: TipoLabel.botonEditar,
    },
    // **BTN VER MÁS
    {
      label: 'UserType',
      field: 'dashboard-backoffice/usuarios-filtro',
      tipoLabel: TipoLabel.botonVermas,
    },
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
    public dashboardBackOffice: DashboardBackOfficeService
  ) {
    this.dashboardBackOffice.dataTitulo.next({
      titulo: '¡Bienvenido!, Acá podrás gestionar los usuarios del Sistema',
      subTitulo: '',
    });
  }

  ngOnInit(): void {
    this.traerUsuariosGenerales(this.pageIndex, this.pageSize);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.traerUsuariosGenerales(this.pageIndex, this.pageSize);
  }

  handlePageSizeChange() {
    this.pageIndex = 0;
    this.traerUsuariosGenerales(this.pageIndex, this.pageSize);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  traerUsuariosGenerales(pageIndex: number, pageSize: number) {
    this.apiService
      .usuariosGenerales(undefined, undefined, pageIndex, pageSize)
      .subscribe(
        (response) => {
          if (response.list && response.list.length > 0) {
            this.usuarios = response.list[0];

            this.usuarios.forEach((usuario) => {
              usuario.provinciasAsignadas = usuario.company.provinces
                .filter((provincia) => provincia.name !== 'No asignado')
                .map((provincia) => provincia.name)
                .join(', ');

              usuario.departamentosAsignados = usuario.departmentAssigned
                .map((departamento) => departamento.name)
                .join(', ');

              usuario.typeUser = this.mapTypeUser(usuario.typeUser);
              usuario.color = this.getColorForUserType(usuario.typeUser);
            });
          } else {
            console.error(
              'La respuesta del servidor no contiene datos válidos.'
            );
          }
        },
        (error) => {
          console.error('Error al obtener usuarios generales:', error);
        }
      );
  }

  getColorForUserType(typeUser: string): string {
    switch (typeUser) {
      case 'Super Admin':
        return '$super-administrador'; // Reemplaza con la variable SCSS correcta si es necesario
      case 'Admin':
        return '$administrador';
      case 'Técnico':
        return '$tecnico';
      case 'Piloto':
        return '$piloto';
      case 'Cooperativa':
        return '$cooperativa';
      default:
        return '';
    }
  }
  // BLOQUE de codigo para setear nombre de perfiles a español !!!
  mapTypeUser(typeUser: string): string {
    const typeMapping: { [key: string]: string } = {
      SUPERUSER: 'Super Admin',
      ADMINISTRATOR: 'Administrador',
      MANAGEMENT: 'Gerente General',
      TECHNICAL: 'Técnico',
      OPERATOR: 'Piloto',
      COOPERATIVE: 'Cooperativa',
    };
    return typeMapping[typeUser] || typeUser;
  }
  aplicarFiltro(filtroSeleccionado: string) {}

  BtnCrearUsuarios() {
    this.router.navigate(['dashboard-backoffice/usuarios']);
  }
}
