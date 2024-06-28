import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardBackOfficeService } from '../../dashboard-backoffice.service';
import {
  TipoLabel,
  DataView,
} from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { ApiService } from 'src/app/services/ApiService';

interface User {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  departmentAssigned: Department[];
  account_active: boolean;
  company: Company;
  typeUser: string;
  provinciasAsignadas?: string; // Añadido para acumulación dinámica
  departamentosAsignados?: string; // Añadido para acumulación dinámica
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
  value?: string; // Ensure 'value' property is defined
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

  userFilterOptions = [
    { value: 'gerenteGeneral', label: 'Gerente General' },
    { value: 'tecnicoGeneral', label: 'Técnico General' },
    { value: 'tecnico', label: 'Técnico' },
    { value: 'piloto', label: 'Piloto' },
    { value: 'cooperativa', label: 'Cooperativa' },
  ];

  public dataView: ExtendedDataView[] = [
    // IMAGEN (ejemplo estático)
    {
      label: '',
      field: 'assets/img/avatar_prod.svg',
      tipoLabel: TipoLabel.imagen,
    },

    // SPAN
    { label: 'Nombre', field: 'name', tipoLabel: TipoLabel.span },
    { label: 'Apellido', field: 'lastname', tipoLabel: TipoLabel.span },
    { label: 'DNI', field: 'dni', tipoLabel: TipoLabel.span },
    { label: 'Tipo de Usuario', field: 'typeUser', tipoLabel: TipoLabel.span },

    // COMPAÑIA
    { label: 'Compañía', field: 'company.name', tipoLabel: TipoLabel.span },

    // PROVINCIAS
    {
      label: 'Provincias',
      field: 'provinciasAsignadas',
      tipoLabel: TipoLabel.span,
      value: '',
    },

    // DEPARTAMENOS
    {
      label: 'Departamentos',
      field: 'departamentosAsignados',
      tipoLabel: TipoLabel.span,
      value: '',
    },

    // VER MÁS (ejemplo estático)

    {
      label: 'Ver Más',
      field: 'dashboard-backoffice/perfil-productor',
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
    console.log('DataView inicial:', this.dataView);
    this.traerUsuariosGenerales();
  }

  traerUsuariosGenerales() {
    this.apiService.usuariosGenerales().subscribe(
      (response) => {
        console.log('Usuarios generales:', response);
        if (response.list && response.list.length > 0) {
          this.usuarios = response.list[0];


          this.usuarios.forEach((usuario) => {
            usuario.provinciasAsignadas = usuario.company.provinces
              .filter((provincia) => provincia.name !== 'No asignado') // Filtra 'No asignado'
              .map((provincia) => provincia.name)
              .join(', ');

            usuario.departamentosAsignados = usuario.departmentAssigned
              .map((departamento) => departamento.name)
              .join(', ');


            usuario.typeUser = this.mapTypeUser(usuario.typeUser);
          });

          console.log('Usuarios procesados:', this.usuarios);
        } else {
          console.error('La respuesta del servidor no contiene datos válidos.');
        }
      },
      (error) => {
        console.error('Error al obtener usuarios generales:', error);
      }
    );
  }
  mapTypeUser(typeUser: string): string {
    const typeMapping: { [key: string]: string } = {
      SUPERUSER: 'Super Admin',
      ADMINISTRATOR: 'Admin',
      TECHNICAL: 'Técnico',
      OPERATOR: 'Piloto',
      COOPERATIVE: 'Cooperativa',
      // Añadir más mapeos según sea necesario
    };
    return typeMapping[typeUser] || typeUser;
  }
  aplicarFiltro(filtroSeleccionado: string) {
    console.log('Filtro seleccionado:', filtroSeleccionado);

  }

  BtnCrearUsuarios() {
    this.router.navigate(['dashboard-backoffice/usuarios']);
  }
}
