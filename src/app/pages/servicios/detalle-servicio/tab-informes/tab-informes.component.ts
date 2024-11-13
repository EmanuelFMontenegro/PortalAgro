import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleServicioService } from '../detalle-servicio.service';
import { AuthService } from 'src/app/services/AuthService';
import { ServiciosService } from 'src/app/services/servicios.service';
import { DialogSubirArchivoComponent } from './dialog-subir-archivo/dialog-subir-archivo.component';
import { MatDialog } from '@angular/material/dialog';

export enum Infome {
  ORDEN_SERVICIO = 'Orden de Servicio',
  TECNICO = 'Informe Técnico',
  APP = 'Informe de App',
  FINAL = 'Informe Final',
}


@Component({
  selector: 'app-tab-informes',
  templateUrl: './tab-informes.component.html',
  styleUrls: ['./tab-informes.component.scss']
})
export class TabInformesComponent {

  dataSource = new MatTableDataSource<any>();
  displayedColumns = ['detalle', 'nombre', 'descripcion', 'acciones']
  puedeSubirArchivoOrden = false;
  puedeSubirArchivoTecnico = false;
  puedeSubirArchivoApp = false;
  puedeSubirArchivoFinal = false;
  informes: any;

  constructor(
    private detalleServicioService: DetalleServicioService,
    public servicioService: ServiciosService,
    private dialog: MatDialog,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.recuperarArchivos()
  }

  recuperarArchivos() {

    let idServicio = this.detalleServicioService.servicio.id
    this.servicioService.getInformes(idServicio).subscribe(
      data => {
        this.informes = data;
        this.generarTabla()
      },
      error => {

      }
    )

    // llamar a servicio que encapsule los 4 archivos y setear en el listado

  }

  generarTabla() {

    let datosTabla: any [] = [];

    if (this.informes?.orden?.read) {
      datosTabla.push(
        {
          detalle: 'Orden de Servicio',
          tipo: Infome.ORDEN_SERVICIO,
          data: this.informes.orden
        }
      )
    }

    if (this.informes?.tecnico?.read) {
      datosTabla.push(
        {
          detalle: 'Informe Técnico',
          tipo: Infome.ORDEN_SERVICIO,
          data: this.informes.tecnico
        }
      )
    }

    if (this.informes?.operador?.read) {
      datosTabla.push(
        {
          detalle: 'Informe de App',
          tipo: Infome.ORDEN_SERVICIO,
          data: this.informes.operador
        }
      )
    }

    if (this.informes?.finalD?.read) {
      datosTabla.push(
        {
          detalle: 'Informe Final',
          tipo: Infome.ORDEN_SERVICIO,
          data: this.informes.finalD
        }
      )
    }

    this.dataSource.data = datosTabla;
  }

  puedeSubirArchivo(tipo: Infome) {
    switch (tipo) {
      case Infome.ORDEN_SERVICIO:
        return this.puedeSubirArchivoOrden
        break;
      case Infome.TECNICO:
        return this.puedeSubirArchivoTecnico
        break;
      case Infome.APP:
        return this.puedeSubirArchivoApp
        break;
      case Infome.FINAL:
        return this.puedeSubirArchivoFinal
        break;
      default:
        return false;
        break;
    }
  }

  subirInforme(tipo: Infome) {
    const dialogRef = this.dialog.open(DialogSubirArchivoComponent, {
      width: '400px',
      data: {
        tipo: tipo,
        showCancel: true,
      },
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) { // si devuelve TRUE refrescar el listado de archivos

      }
    });


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

}

