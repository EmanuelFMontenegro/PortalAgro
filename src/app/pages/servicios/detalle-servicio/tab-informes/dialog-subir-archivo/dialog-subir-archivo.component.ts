import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Infome } from '../tab-informes.component';
import { ServiciosService } from 'src/app/services/servicios.service';
import { DetalleServicioService } from '../../detalle-servicio.service';

@Component({
  selector: 'app-dialog-subir-archivo',
  templateUrl: './dialog-subir-archivo.component.html',
  styleUrls: ['./dialog-subir-archivo.component.scss']
})
export class DialogSubirArchivoComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogSubirArchivoComponent>,
    private toastr: ToastrService,
    private detalleServicioService: DetalleServicioService,
    public servicioService: ServiciosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  // controlName
  ctrlTitle = "title"
  ctrlDescription = "description"
  ctrlDocument = "document"

  titulo = 'Subir ' + this.data.tipo

  public form: FormGroup = new FormGroup({
    [this.ctrlTitle]: new FormControl(null, Validators.required),
    [this.ctrlDescription]: new FormControl(null),
    [this.ctrlDocument]: new FormControl(null, Validators.required),
  })

  recibirArchivo(file: any): void {
    this.form.controls[this.ctrlDocument].setValue(file)
    console.log(this.form.value)
  }

  subir() {

    if (this.form.invalid) {
      this.toastr.info('Faltan campos requeridos', 'Información');
      this.form.markAllAsTouched()
      return;
    }

    let servicioId = this.detalleServicioService.servicioId;
    let body = this.form.getRawValue();
    let llamadaServicio: any = {}

    switch (this.data.tipo) {

      case Infome.ORDEN_SERVICIO:
      llamadaServicio= this.servicioService.postInformeOrdeServicio(servicioId,body)
      break;

      case Infome.TECNICO:
      llamadaServicio = this.servicioService.postInformeTecnico(servicioId,body)
      break;

      case Infome.APP:
      llamadaServicio= this.servicioService.postInformeApp(servicioId,body)
      break;

      case Infome.FINAL:
      llamadaServicio= this.servicioService.postInformeFinal(servicioId,body)
      break;

      default:
      break;
    }

    llamadaServicio.subscribe(
      (data:any) =>{
        this.toastr.info('Informe subido exitosamente','Éxito');
        this.dialogRef.close(true)
      },
      (error:any)=>{
        this.toastr.error('Se produjo un error subiendo el informe', 'Error');
      }
    )

  }

  cancelar() {
    this.dialogRef.close()
  }

}
