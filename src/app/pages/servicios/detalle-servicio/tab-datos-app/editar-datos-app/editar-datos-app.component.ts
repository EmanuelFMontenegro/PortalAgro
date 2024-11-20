import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Piloto } from 'src/app/models/servicios.models';
import { ApiService } from 'src/app/services/ApiService';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ServicioInterno } from '../../../servicios-interno.service';
import { DetalleServicioService } from '../../detalle-servicio.service';
import { TiposDisplayTecnico } from '../../tab-datos-tecnicos/tab-datos-tecnicos.component';

@Component({
  selector: 'app-editar-datos-app',
  templateUrl: './editar-datos-app.component.html',
  styleUrls: ['./editar-datos-app.component.sass']
})
export class EditarDatosAppComponent {


  editar = false;
  servicio: any;
  datosApp: Piloto | undefined;
  tiposPlantacion: any[] = []
  listaPrioridades: any[] = []
  listadoHorarios: any[] = this.getHoras()
  abastecimientoAgua: any[] = [{ descripcion: 'SI', value: true }, { descripcion: 'NO', value: false }]
  minDate = new Date()
  // controlName
  ctrl_dateOfVisit = "dateOfVisit"
  ctrl_hourOfVisit = 'hourOfVisit'
  ctrl_hectare = "hectare"
  ctrl_observation = "observation"
  backOffice = false;

  public form: FormGroup = new FormGroup({
    [this.ctrl_dateOfVisit]: new FormControl(null, Validators.required),
    [this.ctrl_hourOfVisit]: new FormControl(null, Validators.required),
    [this.ctrl_hectare]: new FormControl(null, Validators.required),
    [this.ctrl_observation]: new FormControl(null, Validators.required),
  })
  @Output() btnVolver = new EventEmitter<any>();

  constructor(private toastr: ToastrService,
    private serviciosService: ServiciosService,
    private apiService: ApiService,
    private servicioInterno : ServicioInterno,
    private detalleService: DetalleServicioService,) {

  }

  ngOnInit(): void {
    this.backOffice =  this.servicioInterno.backOffice?.value
    this.servicio = this.detalleService.servicio;
    this.datosApp = this.detalleService.datosPiloto
    this.setFormDatosApp()
  }

  getHoras() {
    let horas: string[] = [];

    for (let i = 0; i < 24; i++) {
      const horaFormateada = i.toString().padStart(2, '0') + ':00';
      horas.push(horaFormateada);
    }

    return horas;
  }

  editarDatos() {
    this.editar = true;
    this.form.enable()
  }

  setFormDatosApp() {
    this.form.patchValue(
      {
        [this.ctrl_dateOfVisit]:   this.getTipoDate(this.datosApp?.dateOfVisit ?? ''),
        [this.ctrl_hectare] : this.datosApp?.hectare,
        [this.ctrl_observation] : this.datosApp?.observation
      }
    )
    this.form.disable()
  }

  getTipoDate(fechaStr: string) {
    const formato = 'DD/MM/YYYY HH:mm';
    const fechaMoment = moment(fechaStr, formato);

    let horaYMinutos = fechaMoment.format('HH:mm');
    if(horaYMinutos){
     this.form.controls[this.ctrl_hourOfVisit].setValue(horaYMinutos)
    }

    return (!fechaMoment.isValid()) ? null : fechaMoment.toDate();
  }

  cancelar() {
    this.form.disable()
    this.editar = false;
  }
  volver() {
    this.form.disable()
    this.btnVolver.emit(TiposDisplayTecnico.tecnico)
  }

  aceptar() {

    if (this.form.invalid) {
      this.toastr.info('Faltan campos requeridos', 'Información');
      this.form.markAllAsTouched()
      return;
    }


    let body = this.form.getRawValue();

    // HORA DE VISITA
    if(body?.hourOfVisit && body.dateOfVisit){
       body.dateOfVisit = moment(body.dateOfVisit).format('DD/MM/YYYY')+' '+ body?.hourOfVisit;
    }


    this.serviciosService.putDatosApp(this.servicio.id, body).subscribe(
      async (data: any) => {
        this.toastr.info(data?.message ?? 'Datos editados exitosamente', 'Éxito');
        await this.detalleService.getDatosApp()
        this.cancelar()
      },
      error => {
        this.toastr.info(error.error.message ?? 'Error editando datos', 'Información');
      }
    )

  }

}
