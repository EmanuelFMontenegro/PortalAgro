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
  producer_id: any;

  listadoTecnicos: any;

  //ctrlNames
  producer = 'producer_id';
  piloto_id = 'piloto_id';

  public form: FormGroup = new FormGroup({
    // [this.producer]: new FormControl(this.data.producer_id, Validators.required),
    [this.piloto_id]: new FormControl(null, Validators.required),
  })

  constructor(public dialogRef: MatDialogRef<AsignarPilotoComponent>,
    private pilotosService: PilotosService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
      this.getPilotos();
    }

    getPilotos() {

      this.pilotosService.getAll_backOffice().subscribe(
        data => {
          this.listadoTecnicos = data.list[0]
        },
        error => {}
      )
    }

    asignarPiloto() {
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        return;
      }

      let datos = this.form.getRawValue()
      console.log(this.data.servicio.id, datos.piloto_id)
      this.pilotosService.asignarPiloto(this.data.servicio.id, datos.piloto_id).subscribe(
        data =>{
          console.log(data)
          this.toastr.success(data?.message ?? 'Piloto asignado con éxito', 'Éxito');
          this.dialogRef.close(true)
        },
        error =>{
          this.toastr.success(error.error?.message ?? 'Error asignando piloto', 'Información');
        }
      )


    }



}
