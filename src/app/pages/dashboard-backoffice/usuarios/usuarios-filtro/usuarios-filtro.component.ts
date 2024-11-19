import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardBackOfficeService } from '../../dashboard-backoffice.service';
import { TipoLabel, DataView } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { ApiService } from 'src/app/services/ApiService';
import { PageEvent } from '@angular/material/paginator';
import { selectButtons, selectFilters } from 'src/app/shared/components/dinamic-searchbar/dinamic-searchbar.config';
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
  styleUrls: ['./usuarios-filtro.component.scss'],
})
export class UsuariosFiltroComponent implements OnInit {
  titulo: string = 'Usuarios';
  usuarios: User[] = [];
  usuariosGenerales: User[] = [];
  templateUsers: User[]= [];
  length = 0;
  pageSizeLabel: string = 'Items por página:';
  pageSize = 500;
  pageIndex = 0;
  pageSizeOptions = [6, 12, 24, 36];
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent: PageEvent | undefined;
  filterConfigs: any;
  buttonConfigs: any;
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
      tipoLabel: TipoLabel.botonEditarWithParams,
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
    this.filterConfigs = selectFilters([
      'ADMINISTRATOR',
     /*  'SUPERUSER', descomentar si se necesita superuser*/
      'GERENTE',
      'MANAGEMENT',
      'TECHNICAL',
      'OPERATOR',
      'COOPERATIVE',]);
  
    this.buttonConfigs = selectButtons([
      'NUEVO_USUARIO_ROLE', 
    ]);
    
    this.traerUsuariosGenerales(this.pageIndex, this.pageSize);
  }

  traerUsuariosGenerales(pageIndex: number, pageSize: number) {
    this.apiService
      .usuariosGenerales(undefined, undefined, pageIndex, pageSize)
      .subscribe(
        (response) => {
          if (response && response.list && response.list.length > 0) {
            this.usuarios = response.list[0];
            this.length = response.totalCount || 0;

            this.usuarios.forEach((usuario) => {
              usuario.provinciasAsignadas = usuario.company.provinces
                .filter((provincia) => provincia.name !== 'No asignado')
                .map((provincia) => provincia.name)
                .join(', ');

              usuario.departamentosAsignados = usuario.departmentAssigned
                .map((departamento) => departamento.name)
                .join(', ');

              usuario.typeUser = this.mapTypeUser(usuario.typeUser);
               });
               /* es una solucion temp ya que no se usa services ni persistencia,
                hacemos un shadow copy de la variable principal */
            this.templateUsers = [...this.usuarios];
          } else {
            this.usuarios = [];
            this.length = 0;
            console.error(
              'La respuesta del servidor no contiene datos válidos.'
            );
          }
        },
        (error) => {
          console.error('Error al obtener usuarios generales:', error);
          this.usuarios = []; // Limpia `usuarios` en caso de error
          this.length = 0; // Asegúrate de que `length` esté en 0 en caso de error
        }
      );
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
  aplicarFiltro(filtroSeleccionado: string) {
    var temp = this.usuarios.filter((usuario) =>{
      return usuario.typeUser === filtroSeleccionado});
      this.templateUsers = temp;
  }

  BtnCrearUsuarios() {
    this.router.navigate(['dashboard-backoffice/usuarios']);
  }
 
  clearFilter() { 
    this.templateUsers = [...this.usuarios];
  }
  
  onFilter(filtro: any) { 
    if(filtro){
      this.aplicarFiltro(filtro.value);
    }
     else {
      console.warn(`No se encontró un manejador para el filtro tipo: ${filtro.type}`);
    }  
  }

}
