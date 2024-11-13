import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DetalleServicioService } from '../../detalle-servicio.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/pages/dashboard/dialog/dialog.component';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cambiar-estado',
  templateUrl: './cambiar-estado.component.html',
  styleUrls: ['./cambiar-estado.component.sass']
})
export class CambiarEstadoComponent {
  mostrarSelector = true;
  @Input() selectorEstados = true;
  estadoSolicitudBajaServicio = false;

  constructor(public detalleServicioService: DetalleServicioService,
    private servicioService: ServiciosService,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ){}

  ngOnInit(): void {
    this.estadoSolicitudBajaServicio = this.detalleServicioService.servicio.status.name == "SOLICITUD_BAJA"
  }


  cambioEstado(idEstado:number){
    let idServicio = this.detalleServicioService.servicioId;
    this.servicioService.putStatusByService(idServicio, idEstado).subscribe(
      (data:any) =>{
        this.toastr.info(data?.message ?? 'Estado cambiado exitosamente', 'Éxito');
        this.detalleServicioService.estado.next(true)
      },
      error=>{}
    )

  }

  dialogConfirmacionCambiarEstado(valor:any){
    let estado = valor?.value?.name;
    this.mostrarSelector = false;
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        titulo: 'Cambiar estado del servicio',
        message: `¿Desea cambiar el estado a ${estado}?`,
        showCancel: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.mostrarSelector = true;
      if (result){
         this.cambioEstado(valor?.value?.id)
        }
    });
  }

  dialogConfirmacionSolicitudBaja(){
    this.mostrarSelector = false;
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        titulo: 'Solicitar baja del servicio',
        message: `¿Desea solicitar la baja del servicio?`,
        showCancel: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.mostrarSelector = true;
      if (result){
         this.cambioEstado(6) // solicitud baja del servicio
        }
    });
  }

}
