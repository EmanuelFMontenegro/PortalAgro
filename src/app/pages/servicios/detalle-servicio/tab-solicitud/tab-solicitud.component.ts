import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetalleServicioService } from '../detalle-servicio.service';
import { AsignarPilotoComponent } from './asignar-piloto/asignar-piloto.component';
import { AsignarTecnicoComponent } from './asignar-tecnico/asignar-tecnico.component';
import { VerLotesComponent } from './ver-lotes/ver-lotes.component';

@Component({
  selector: 'app-tab-solicitud',
  templateUrl: './tab-solicitud.component.html',
  styleUrls: ['./tab-solicitud.component.scss']
})
export class TabSolicitudComponent {
  servicio: any
  constructor(  public detalleServicioService: DetalleServicioService,
    private dialog: MatDialog,){
    this.detalleServicioService.getServicio();
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

    dialogRef.afterClosed().subscribe((result) => {

      if(result){ // asigno un piloto
        this.detalleServicioService.actualizarDatosServicio();

        // recuperar el piloto


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

    dialogRef.afterClosed().subscribe((result) => {});
  }

  verLotes(){
    const dialogRef = this.dialog.open(VerLotesComponent, {
      width: '400px',
      data: {
        plots: this.servicio.plots
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

}
