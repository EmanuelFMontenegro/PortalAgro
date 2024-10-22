import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PermisosUsuario } from 'src/app/models/permisos.model';
import { DialogComponent } from 'src/app/pages/dashboard/dialog/dialog.component';
import { InsumoService } from 'src/app/services/insumo.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { TipoLabel } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { ServicioInterno } from '../../../servicios-interno.service';
import { DetalleServicioService } from '../../detalle-servicio.service';
import { TiposDisplayTecnico } from '../tab-datos-tecnicos.component';

@Component({
  selector: 'app-lista-insumos',
  templateUrl: './lista-insumos.component.html',
  styleUrls: ['./lista-insumos.component.scss']
})
export class ListaInsumosComponent {

  mostrarListado = true;
  listadoTiposInsumos: any;
  listadoInsumos:any;
  servicio: any;
  backOffice = false;

  // controlName
  ctrlProducto = "productInput"
  ctrlDosis = "doseToBeApplied"
  ctrlHectarea = "hectaresPerLiter"

  public form: FormGroup = new FormGroup({
    [this.ctrlProducto]: new FormControl(null, Validators.required),
    [this.ctrlDosis]: new FormControl(null, Validators.required),
    [this.ctrlHectarea]: new FormControl(null, Validators.required),
  })

  dataView = [
    {label: 'Nombre', field: 'productInput.name', tipoLabel: TipoLabel.span},
    {label: 'Dosis', field:'doseToBeApplied', tipoLabel: TipoLabel.span },
    {label: 'Litros por hectárea', field:'hectaresPerLiter', tipoLabel: TipoLabel.span },
    {label: 'Ver insumos', field: 'dashboard-backoffice/configuracion/insumo', tipoLabel: TipoLabel.botonVermas},
  ]

  @Output() btnVolver = new EventEmitter<any>();

  constructor(
    private toastr: ToastrService,
    private serviciosService: ServiciosService,
    private dialog: MatDialog,
    private servicioInterno : ServicioInterno,
    private detalleService: DetalleServicioService,
    private insumosService: InsumoService
  ){
  }

  ngOnInit(): void {
    this.backOffice =  this.servicioInterno.backOffice?.value
    this.servicio = this.detalleService.servicio;
    this.setMiniaturas()
    this.getInsumos()
    this.getTiposInsumos()
  }

  setMiniaturas(){
   if(this.detalleService.permisos?.jobTechnical?.WRITE || this.detalleService.permisos?.jobTechnical?.WRITE_MY)
   this.dataView.push({label: 'Eliminar', field: 'id', tipoLabel: TipoLabel.botonEliminar})
  }

  getInsumos(){
     this.serviciosService.getInsumosTecnico(this.servicio.id).subscribe(
      (data:any) =>{
        this.listadoInsumos = data.list[0]
        console.log(data)
      },
      error =>{

      }
     )
  }

  dialogConfirmacionEliminar(valor:any){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        titulo: 'Eliminar Insumo',
        message: `¿Desea eliminar el insumo?`,
        showCancel: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) this.eliminarInsumo(valor)
    });
  }

  eliminarInsumo(valor:any){
    this.serviciosService.deleteInsumosTecnico(this.servicio.id, valor).subscribe(
      (data:any )=>{
        this.toastr.info(data?.message ?? 'Insumo eliminado exitosamente', 'Éxito');
        this.getInsumos()
      },
      error =>{
        this.toastr.info(error.error?.message ?? 'Error eliminando insumo', 'Información');
        console.log("ERROR ELIMINADO", error)
      }
    )
  }

  getTiposInsumos(){
   this.insumosService.getAll().subscribe(
    data => {
      this.listadoTiposInsumos = data.list[0]
    },
    error => {}
   )
  }

  openABM(){
    this.mostrarListado = false;
  }

  cancelar(){
     this.mostrarListado = true;
  }

  volver(){
    this.btnVolver.emit(TiposDisplayTecnico.tecnico)
  }

  aceptar(){

    if(this.form.invalid){
      this.toastr.info('Faltan campos requeridos', 'Información');
      this.form.markAllAsTouched()
      return;
    }

    this.serviciosService.postDatosTecnicos(this.servicio.id,this.form.getRawValue()).subscribe(
      (data: any) => {
        this.toastr.info(data?.message ?? 'Insumo cargado exitosamente', 'Éxito');
        this.cancelar()
        this.getInsumos()
      },
      error => {
      this.toastr.info(error.error.message ?? 'Error agregando insumo', 'Información');
      }
    )

  }

}
