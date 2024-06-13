import { Component } from '@angular/core';
import {  ConfiguracionService } from 'src/app/services/configuracion.service';
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


  constructor( private configuracionService: ConfiguracionService,
               public dashboardBackOffice: DashboardBackOfficeService)
              {
                this.dashboardBackOffice.dataTitulo.next({ titulo: 'Configuración' , subTitulo: ''})
              }

  listado: any [] = []
  dataView: DataView [] = [
     {label: '', field: 'assets/img/lote_1.svg', tipoLabel: TipoLabel.imagen},

     {label: 'Nombre', field: 'nickname', tipoLabel: TipoLabel.span},
     {label: 'Función', field:'function', tipoLabel: TipoLabel.span },
     {label: 'Marca', field:'brand', tipoLabel: TipoLabel.span },
     {label: 'Modelo', field: 'model', tipoLabel: TipoLabel.span},

     {label: 'Ver mas', field: 'assets/img/lote_1.svg', tipoLabel: TipoLabel.botonVermas},

  ]
  opcionSeleccionada = TiposConfiguraciones.drones

  drones = TiposConfiguraciones.drones;
  insumos = TiposConfiguraciones.insumos;


  ngOnInit(): void {
   this.getDrones()
  }

  getDrones(){
    this.configuracionService.getDronesFiltrados(15).subscribe(
      data =>{
        if(data.list.length){
          this.listado = data.list[0]
          console.log(this.listado)
        }

      }
    )
  }

  getInsumos(){
    this.configuracionService.getDronesFiltrados(15).subscribe(
      data =>{
        if(data.list.length){
          this.listado = data.list[0]
          console.log(this.listado)
        }

      }
    )

  }

  cambiarConfig(data:any){
    let tipoConfig = data.value
    switch (tipoConfig) {
      case TiposConfiguraciones.drones:
        this.getDrones()
        break;

      default:
        break;
    }
     console.log(data)
  }

  nuevo(){

  }

}
