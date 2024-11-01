import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleServicioService } from '../detalle-servicio.service';
import { AuthService } from 'src/app/services/AuthService';
import { ServiciosService } from 'src/app/services/servicios.service';

export enum Infome {
  ORDEN_SERVICIO = 1,
  TECNICO = 2,
  APP = 3,
  FINAL = 4,
}


@Component({
  selector: 'app-tab-informes',
  templateUrl: './tab-informes.component.html',
  styleUrls: ['./tab-informes.component.scss']
})
export class TabInformesComponent {

  dataSource: any;
  displayedColumns = ['detalle', 'acciones']
  puedeSubirArchivo = false;

  constructor(
    public servicioService: ServiciosService,
    public authService: AuthService) {}

  ngOnInit(): void {

    this.dataSource.data = [
      {
        detalle: 'Orden de Servicio',
        tipo: Infome.ORDEN_SERVICIO
      },
      {
        detalle: 'Informe Técnico',
        tipo: Infome.TECNICO
      },
      {
        detalle: 'Informe de App',
        tipo: Infome.APP
      },
      {
        detalle: 'Informe Final',
        tipo: Infome.FINAL
      }
    ]
  }


  subirInforme(tipo: Infome) {
    // switch (tipo) {
    //   case Infome.APP:
    //     this.servicioService.
    //     break;

    //   default:
    //     break;
    // }

  }

  descargarInforme(tipo: Infome) {

  // switch (tipo) {
    //   case Infome.APP:
    //     this.servicioService.
    //     break;

    //   default:
    //     break;
    // }

  }

  verInforme(tipo: Infome) {

  }

}

