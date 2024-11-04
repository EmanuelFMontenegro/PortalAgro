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
  constructor(
    private detalleServicioService: DetalleServicioService,
    public servicioService: ServiciosService,
    private dialog: MatDialog,
    public authService: AuthService) { }

  ngOnInit(): void {

    this.puedeSubirArchivoOrden = this.detalleServicioService.permisos?.requestservice?.WRITE || this.detalleServicioService.permisos?.requestservice?.WRITE_MY ? true : false;
    this.puedeSubirArchivoTecnico = this.detalleServicioService.permisos?.jobTechnical?.WRITE || this.detalleServicioService.permisos?.jobTechnical?.WRITE_MY ? true : false;
    this.puedeSubirArchivoApp = this.detalleServicioService.permisos?.jobOperator?.WRITE || this.detalleServicioService.permisos?.jobOperator?.WRITE_MY ? true : false;
    this.puedeSubirArchivoFinal = this.detalleServicioService.permisos?.requestservice?.WRITE || this.detalleServicioService.permisos?.requestservice?.WRITE_MY ? true : false;

    this.recuperarArchivos()

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

  recuperarArchivos() {

    // llamar a servicio que encapsule los 4 archivos y setear en el listado

  }

  puedeSubirArchivo(tipo: Infome) {
    switch (tipo) {
      case Infome.ORDEN_SERVICIO:
         return this.puedeSubirArchivoOrden
        break;
      case Infome.TECNICO:
        return  this.puedeSubirArchivoTecnico
        break;
      case Infome.APP:
        return  this.puedeSubirArchivoApp
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

    dialogRef.afterClosed().subscribe(async (result:any) => {
      if(result){ // si devuelve TRUE refrescar el listado de archivos

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

