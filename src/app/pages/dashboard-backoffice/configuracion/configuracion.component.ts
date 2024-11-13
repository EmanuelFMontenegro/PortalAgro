import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PermisoBasico } from 'src/app/models/permisos.model';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { DronService } from 'src/app/services/dron.service';
import { InsumoService } from 'src/app/services/insumo.service';
import { PermisoService } from 'src/app/services/permisos.service';
import {
  TipoLabel,
  DataView,
} from 'src/app/shared/components/miniatura-listado/miniatura.model';
import {
  DashboardBackOfficeService,
} from '../dashboard-backoffice.service';
import { ButtonConfig, FilterConfig } from 'src/app/models/searchbar.model';
import { selectButtons, selectFilters } from 'src/app/shared/components/dinamic-searchbar/dinamic-searchbar.config';

export enum TiposConfiguraciones {
  insumos = 'Insumos',
  drones = 'Drones',
}

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.sass'],
})
export class ConfiguracionComponent {
  constructor(
    private dronService: DronService,
    private insumoService: InsumoService,
    private router: Router,
    private permisoService: PermisoService,
    public dashboardBackOffice: DashboardBackOfficeService) {}

  listado: any[] = [];
  dataView: DataView[] = [];
  opcionSeleccionada = TiposConfiguraciones.drones;
  drones = TiposConfiguraciones.drones;
  insumos = TiposConfiguraciones.insumos;
  permisosComponente: PermisoBasico = {};
  alta: any;
  buttonConfigs: ButtonConfig[] = [];
  filterConfigs: FilterConfig[]= [];
  title: string= '';
  ngOnInit(): void {
    this.filterConfigs = selectFilters([
      'LISTA_DRONES',
      'LISTA_INSUMOS',
    ]);

    this.buttonConfigs = selectButtons([
      'AGREGAR_DRON', 
      'AGREGAR_INSUMO'
    ]);
    this.configDrones();
  }

  configDrones() {
    this.title = 'Drones';
    this.alta = TiposConfiguraciones.drones;
    if (this.permisoService.permisoUsuario?.value?.drone)
      this.permisosComponente = this.permisoService.permisoUsuario?.value.drone;
    this.dataView = [
      {
        label: '',
        field: 'assets/img/Chacra_1.png',
        tipoLabel: TipoLabel.imagen,
      },
      { label: 'Nombre', field: 'nickname', tipoLabel: TipoLabel.span },
      { label: 'Función', field: 'function', tipoLabel: TipoLabel.span },
      { label: 'Marca', field: 'brand', tipoLabel: TipoLabel.span },
      { label: 'Modelo', field: 'model', tipoLabel: TipoLabel.span },
      {
        label: 'Ver mas',
        field: 'dashboard-backoffice/configuracion/dron',
        tipoLabel: TipoLabel.botonVermas,
      },
    ];
    this.getDrones();
  }

  getDrones() {
    this.dronService.getAll().subscribe((data) => {
      if (data.list.length) this.listado = data.list[0];
    });
  }

  onFilter(filtro: any) { 
    const filterHandlers: { [key: string]: (value: any) => void } = {
      'Filtro para lista de drones': (value) => this.configDrones(),
      'Filtro para lista de insumos': (value) => this.configInsumos(),
    };
    const handler = filterHandlers[filtro.type];
    
    if (handler) {
      handler(filtro.value);
    } else {
      console.warn(`No se encontró un manejador para el filtro tipo: ${filtro.type}`);
    }
  }

  configInsumos() {
    this.title = 'Insumos';
    this.alta = TiposConfiguraciones.insumos;
    if (this.permisoService.permisoUsuario?.value?.supplies)
      this.permisosComponente =
        this.permisoService.permisoUsuario?.value.supplies;
    this.dataView = [
      {
        label: '',
        field: 'assets/img/Chacra_1.png',
        tipoLabel: TipoLabel.imagen,
      },
      { label: 'Nombre', field: 'name', tipoLabel: TipoLabel.span },
      { label: 'Código', field: 'code', tipoLabel: TipoLabel.span },
      { label: 'Presentación', field: 'formato', tipoLabel: TipoLabel.span },
      { label: 'Producto', field: 'description', tipoLabel: TipoLabel.span },
      {
        label: 'Ver mas',
        field: 'dashboard-backoffice/configuracion/insumo',
        tipoLabel: TipoLabel.botonVermas,
      },
    ];
    this.getInsumos();
  }

  getInsumos() {
    this.insumoService.getAll().subscribe((data) => {
      if (data.list?.length) this.listado = data.list[0];
    });
  }

  cambiarConfig(data: any) {
    console.log(this.permisoService.permisoUsuario);
    let tipoConfig = data.value;
    switch (tipoConfig) {
      case TiposConfiguraciones.drones:
        this.configDrones();
        break;
      case TiposConfiguraciones.insumos:
        this.configInsumos();
        break;
      default:
        break;
    }
  }

   
}
