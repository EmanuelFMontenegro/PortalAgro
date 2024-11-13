import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PilotosService } from 'src/app/services/pilotos.service';

@Component({
  selector: 'app-asignar-piloto',
  templateUrl: './asignar-piloto.component.html',
  styleUrls: ['./asignar-piloto.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsignarPilotoComponent {
  listadoPilotos: any;

  //ctrlNames
  piloto_id = 'piloto_id';

  public form: FormGroup = new FormGroup({
    [this.piloto_id]: new FormControl(null, Validators.required),
  })

  constructor(public dialogRef: MatDialogRef<AsignarPilotoComponent>,
    private pilotosService: PilotosService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
      this.getPilotos();
      if(this.data.servicio?.jobOperator) this.form.controls[this.piloto_id].setValue(this.data.servicio?.jobOperator?.id)
    }

    getPilotos() {
      this.pilotosService.getAll_backOfficeByLocation(this.data.servicio.location.id).subscribe(
        data => {
          this.listadoPilotos = data.list[0]
        },
        error => {}
      )
    }

    cencelar(){
      this.dialogRef.close()
    }

    asignarPiloto() {
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        return;
      }

      let datos = this.form.getRawValue()
      this.pilotosService.asignarPiloto(this.data.servicio.id, datos.piloto_id).subscribe(
        data =>{
          this.toastr.success(data?.message ?? 'Piloto asignado con éxito', 'Éxito');
          this.dialogRef.close(true)
        },
        error =>{
          this.toastr.error(error.error?.message ?? 'Error asignando piloto', 'Error');
        }
      )


    }



}
