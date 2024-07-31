import { Component } from '@angular/core';
import { DetalleServicioService } from '../detalle-servicio.service';

@Component({
  selector: 'app-tab-solicitud',
  templateUrl: './tab-solicitud.component.html',
  styleUrls: ['./tab-solicitud.component.scss']
})
export class TabSolicitudComponent {
  servicio: any
  constructor(  public detalleServicioService: DetalleServicioService,){
    this.detalleServicioService.getServicio();
    this.servicio = this.detalleServicioService.servicio;
  }

}
