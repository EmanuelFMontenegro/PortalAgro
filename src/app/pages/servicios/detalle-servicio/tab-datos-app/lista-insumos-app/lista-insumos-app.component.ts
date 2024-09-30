import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { InsumoService } from 'src/app/services/insumo.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { TipoLabel } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { DetalleServicioService } from '../../detalle-servicio.service';
import { TiposDisplayApp } from '../tab-datos-app.component';
import { DialogEditarInsumoComponent } from './dialog-editar-insumo/dialog-editar-insumo.component';

@Component({
  selector: 'app-lista-insumos-app',
  templateUrl: './lista-insumos-app.component.html',
  styleUrls: ['./lista-insumos-app.component.sass']
})
export class ListaInsumosAppComponent {

  mostrarListado = true;
  listadoTiposInsumos: any;
  listadoInsumos:any;
  servicio: any;

  dataView = [
    {label: 'Nombre', field: 'productInput.name', tipoLabel: TipoLabel.span},
    {label: 'Dosis', field:'doseToBeApplied', tipoLabel: TipoLabel.span },
    {label: 'Litros por hectárea', field:'hectaresPerLiter', tipoLabel: TipoLabel.span },
    {label: 'Sobrantes', field:'surplus', tipoLabel: TipoLabel.span },
    {label: 'Editar', field: 'id', tipoLabel: TipoLabel.botonEditarDevolverObjeto},
  ]

  @Output() btnVolver = new EventEmitter<any>();

  constructor(
    private serviciosService: ServiciosService,
    private dialog: MatDialog,
    private detalleService: DetalleServicioService,
  ){

  }

  ngOnInit(): void {
    this.servicio = this.detalleService.servicio;
    this.getInsumos()
    // this.getTiposInsumos()
  }

  getInsumos(){
     this.serviciosService.getInsumosTecnico(this.servicio.id).subscribe(
      (data:any) =>{
        this.listadoInsumos = data.list[0]
      },
      error =>{

      }
     )
  }

   dialogEditar(valor:any){
    const dialogRef = this.dialog.open(DialogEditarInsumoComponent, {
      width: '400px',
      data: valor
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) this.getInsumos()
    });
  }

  volver(){
    this.btnVolver.emit(TiposDisplayApp.app)
  }

}
