import { Component } from '@angular/core';
import { DetalleServicioService } from '../detalle-servicio.service';

@Component({
  selector: 'app-tab-datos-app',
  templateUrl: './tab-datos-app.component.html',
  styleUrls: ['./tab-datos-app.component.scss']
})
export class TabDatosAppComponent {

  servicio: any
  constructor(  public detalleServicioService: DetalleServicioService,){
    this.detalleServicioService.getServicio();
    this.servicio = this.detalleServicioService.servicio;
  }
}
