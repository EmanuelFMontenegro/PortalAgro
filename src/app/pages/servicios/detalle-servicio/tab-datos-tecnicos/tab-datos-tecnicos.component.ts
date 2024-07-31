import { Component } from '@angular/core';
import { DetalleServicioService } from '../detalle-servicio.service';

@Component({
  selector: 'app-tab-datos-tecnicos',
  templateUrl: './tab-datos-tecnicos.component.html',
  styleUrls: ['./tab-datos-tecnicos.component.scss']
})
export class TabDatosTecnicosComponent {

  servicio: any
  constructor(  public detalleServicioService: DetalleServicioService,){
    this.detalleServicioService.getServicio();
    this.servicio = this.detalleServicioService.servicio;
  }
}
