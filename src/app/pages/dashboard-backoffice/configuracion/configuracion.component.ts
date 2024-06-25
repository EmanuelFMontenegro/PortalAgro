import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {  ConfiguracionService } from 'src/app/services/configuracion.service';
import { DronService } from 'src/app/services/dron.service';
import { InsumoService } from 'src/app/services/insumo.service';
import { TipoLabel, DataView } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { DashboardBackOfficeService, Titulo } from '../dashboard-backoffice.service';

export enum TiposConfiguraciones{
  insumos = 'Insumos',
  drones = 'Drones'
}

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.sass']
})

export class ConfiguracionComponent {


  constructor( private dronService: DronService,
               private insumoService:InsumoService,
               private router: Router,
               public dashboardBackOffice: DashboardBackOfficeService)
              {
                this.dashboardBackOffice.dataTitulo.next({ titulo: 'Configuración' , subTitulo: ''})
              }

  listado: any [] = []
  dataView: DataView [] = []
  opcionSeleccionada = TiposConfiguraciones.drones
  drones = TiposConfiguraciones.drones;
  insumos = TiposConfiguraciones.insumos;
  alta: any;

  ngOnInit(): void {
   this.configDrones();
  }

  configDrones(){
    this.alta = TiposConfiguraciones.drones
    this.dataView = [
      {label: '', field: 'assets/img/lote_1.svg', tipoLabel: TipoLabel.imagen},
      {label: 'Nombre', field: 'nickname', tipoLabel: TipoLabel.span},
      {label: 'Función', field:'function', tipoLabel: TipoLabel.span },
      {label: 'Marca', field:'brand', tipoLabel: TipoLabel.span },
      {label: 'Modelo', field: 'model', tipoLabel: TipoLabel.span},
      {label: 'Ver mas', field: 'dashboard-backoffice/configuracion/dron', tipoLabel: TipoLabel.botonVermas},
    ]
    this.getDrones();
  }

  getDrones(){
    this.dronService.getAll().subscribe(
      data =>{
        if(data.list.length)this.listado = data.list[0]
      })
  }

  configInsumos(){
    this.alta = TiposConfiguraciones.insumos
    this.dataView = [
      {label: '', field: 'assets/img/lote_3.svg', tipoLabel: TipoLabel.imagen},
      {label: 'Nombre', field: 'name', tipoLabel: TipoLabel.span},
      {label: 'Código', field:'code', tipoLabel: TipoLabel.span },
      {label: 'Presentación', field:'formato', tipoLabel: TipoLabel.span },
      {label: 'Producto', field: 'description', tipoLabel: TipoLabel.span},
      {label: 'Ver mas', field: 'dashboard-backoffice/configuracion/insumo', tipoLabel: TipoLabel.botonVermas},
    ]
    this.getInsumos();
  }

  getInsumos(){
    this.insumoService.getAll().subscribe(
      data =>{
        if(data.list?.length) this.listado = data.list[0]
      })
  }

  cambiarConfig(data:any){
    let tipoConfig = data.value
    switch (tipoConfig) {
      case TiposConfiguraciones.drones:
        this.configDrones()
        break;
      case TiposConfiguraciones.insumos:
          this.configInsumos()
          break;
      default:
        break;
    }
  }

  nuevo(){
    switch (this.alta) {
      case TiposConfiguraciones.drones:
        this.router.navigate(['dashboard-backoffice/configuracion/dron']);
        break;
      case TiposConfiguraciones.insumos:
        this.router.navigate(['dashboard-backoffice/configuracion/insumo']);
        break;
      default:
        break;
    }
  }

}
