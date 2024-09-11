import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-asignar-tecnico',
  templateUrl: './asignar-tecnico.component.html',
  styleUrls: ['./asignar-tecnico.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsignarTecnicoComponent {
  producer_id: any;

  listadoTecnicos: any;

  //ctrlNames
  producer = 'producer_id';
  tecnico_id = 'tecnico_id';

  public form: FormGroup = new FormGroup({
    [this.producer]: new FormControl(this.data.producer_id, Validators.required),
    [this.tecnico_id]: new FormControl(null, Validators.required),
  })

  constructor(public dialogRef: MatDialogRef<AsignarTecnicoComponent>,
    private tecnicoService: TecnicoService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.producer_id = this.data.producer_id
  }

  ngOnInit(): void {
    this.getTecnicos();
  }

  getTecnicos() {

    this.tecnicoService.getAll_backOffice().subscribe(
      data => {
        this.listadoTecnicos = data.list[0]
      },
      error => {}
    )
  }

  asignarTecnico() {
    if (this.form.valid) {
      this.form.markAllAsTouched()
      return;
    }

    this.form
  }

}
