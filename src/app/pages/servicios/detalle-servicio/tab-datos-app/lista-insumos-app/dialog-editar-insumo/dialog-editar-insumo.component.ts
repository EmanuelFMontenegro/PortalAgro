import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { InsumoService } from 'src/app/services/insumo.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { TipoLabel } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { DetalleServicioService } from '../../../detalle-servicio.service';
import { TiposDisplayApp } from '../../tab-datos-app.component';

@Component({
  selector: 'app-dialog-editar-insumo',
  templateUrl: './dialog-editar-insumo.component.html',
  styleUrls: ['./dialog-editar-insumo.component.scss']
})
export class DialogEditarInsumoComponent {

  listadoTiposInsumos: any;
  listadoInsumos:any;
  servicio: any;
  insumo:any;

  // controlName
  ctrlSobrantes = "surplus"

  public form: FormGroup = new FormGroup({
    [this.ctrlSobrantes]: new FormControl(null, Validators.required),
  })

  @Output() btnVolver = new EventEmitter<any>();

  constructor(
    private toastr: ToastrService,
    private serviciosService: ServiciosService,
    public dialogRef: MatDialogRef<DialogEditarInsumoComponent>,
    private detalleService: DetalleServicioService,
    private insumosService: InsumoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){

  }

  ngOnInit(): void {
    this.servicio = this.detalleService.servicio;
    this.insumo = this.data
    this.form.patchValue(this.insumo)
  }

  volver(){
    this.btnVolver.emit(TiposDisplayApp.app)
  }

  cancelar(){
    this.dialogRef.close()
  }

  editarInsumo(){


      if(this.form.invalid){
        this.toastr.info('Faltan campos requeridos', 'Información');
        this.form.markAllAsTouched()
        return;
      }

      let bodyInsumos = this.form.getRawValue()

      this.serviciosService.putInsumoApp(this.servicio.id,this.insumo.productInput.id, bodyInsumos).subscribe(
        (data: any) => {
          this.toastr.success(data?.message ?? 'Insumo editado exitosamente', 'Éxito');
          this.dialogRef.close(true)
        },
        (error:any) => {
        this.toastr.error(error.error.message ?? 'Error editando insumo', 'Información');
        }
      )

  }


}
