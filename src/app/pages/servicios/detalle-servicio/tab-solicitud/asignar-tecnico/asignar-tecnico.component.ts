import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TecnicoService } from 'src/app/services/tecnico.service';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-asignar-tecnico',
  templateUrl: './asignar-tecnico.component.html',
  styleUrls: ['./asignar-tecnico.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsignarTecnicoComponent {
  listadoTecnicos: any;

  //ctrlNames
  tecnico_id = 'tecnico_id';

  public form: FormGroup = new FormGroup({
    [this.tecnico_id]: new FormControl(null, Validators.required),
  })

  constructor(public dialogRef: MatDialogRef<AsignarTecnicoComponent>,
    private toastr: ToastrService,
    private tecnicoService: TecnicoService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.getTecnicos();
    if(this.data.servicio?.jobOperator) this.form.controls[this.tecnico_id].setValue(this.data.servicio?.jobtechnical?.id)
  }

  async getTecnicos(){
    let todosTecnicos = await this.getTecnicosGenerales()
    let tecnicosByLocalidad = await this.getTecnicosByLocation()

    this.listadoTecnicos = [...todosTecnicos,...tecnicosByLocalidad]
  }

  getTecnicosByLocation() {
    return new Promise<any>((resolve)=>{
      this.tecnicoService.getAll_backOfficeByLocation(this.data.servicio.location.id).subscribe(
        data =>  resolve(data.list[0]),
        error => { resolve([])}
      )
    })
  }

  getTecnicosGenerales() {
    return new Promise<any>((resolve)=>{
      this.tecnicoService.getAll_backOffice()
      .pipe(map( (tecnicos:any) => tecnicos.list[0].filter( (tecnico:any) => tecnico.departmentAssigned.length === 0 )))
      .subscribe(
        data =>  resolve(data),
        error => { resolve([])}
      )
    })
  }

  cencelar(){
    this.dialogRef.close()
  }

  asignarTecnicos() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return;
    }

    let datos = this.form.getRawValue()
    this.tecnicoService.asignarTecnico(this.data.servicio.id, datos.tecnico_id).subscribe(
      data =>{
        this.toastr.success(data?.message ?? 'Técnico asignado con éxito', 'Éxito');
        this.dialogRef.close(true)
      },
      error =>{
        this.toastr.error(error.error?.message ?? 'Error asignando técnico', 'Error');
      }
    )

  }

}
