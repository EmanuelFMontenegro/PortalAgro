import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetalleServicioService } from '../detalle-servicio.service';
import { AsignarPilotoComponent } from './asignar-piloto/asignar-piloto.component';
import { AsignarTecnicoComponent } from './asignar-tecnico/asignar-tecnico.component';
import { VerLotesComponent } from './ver-lotes/ver-lotes.component';

export enum TiposDisplaySolicitud{
  solicitud = 0,
  lotes = 1,
}

@Component({
  selector: 'app-tab-solicitud',
  templateUrl: './tab-solicitud.component.html',
  styleUrls: ['./tab-solicitud.component.scss']
})
export class TabSolicitudComponent {
  servicio: any
  display = TiposDisplaySolicitud.solicitud;
  tipoDisplay = TiposDisplaySolicitud

  constructor(  public detalleServicioService: DetalleServicioService,
    private dialog: MatDialog,){
    this.servicio = this.detalleServicioService.servicio;
  }

  asignarPiloto(){

    const dialogRef = this.dialog.open(AsignarPilotoComponent, {
      width: '400px',
      data: {
        servicio: this.servicio,
        showCancel: true,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if(result){ // asigno un piloto
       await this.detalleServicioService.getServicio()
       this.servicio = this.detalleServicioService.servicio;
      }
    });
  }

  asignarTecnico(){

    const dialogRef = this.dialog.open(AsignarTecnicoComponent, {
      width: '400px',
      data: {
        servicio: this.servicio,
        showCancel: true,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if(result){ // asigno un tecnico
        await this.detalleServicioService.getServicio()
        this.servicio = this.detalleServicioService.servicio;
       }
    });
  }

  verLotes(){
     this.display = this.tipoDisplay.lotes
  }

  setBtnVolver(valor:any){
    this.display = valor;
  }

}
