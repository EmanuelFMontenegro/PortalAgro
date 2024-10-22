import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserToken } from 'src/app/models/auth.models';
import { PermisosUsuario } from 'src/app/models/permisos.model';
import { AuthService } from 'src/app/services/AuthService';
import { ServicioInterno } from '../../servicios-interno.service';
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
  asigPiloto = false;
  asigTecnico = false;
  backOffice = false;

  constructor(  public detalleServicioService: DetalleServicioService,
    public authService: AuthService,
    private servicioInterno : ServicioInterno,
    private dialog: MatDialog,){
    this.servicio = this.detalleServicioService.servicio;
  }

  ngOnInit(): void {
    this.backOffice =  this.servicioInterno.backOffice?.value
    this.asigPiloto = this.detalleServicioService.permisos?.jobOperator?.CREATE || this.detalleServicioService.permisos?.jobOperator?.CREATE_MY ? true : false;
    this.asigTecnico = this.detalleServicioService.permisos?.jobTechnical?.CREATE || this.detalleServicioService.permisos?.jobTechnical?.CREATE_MY ? true : false;
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
