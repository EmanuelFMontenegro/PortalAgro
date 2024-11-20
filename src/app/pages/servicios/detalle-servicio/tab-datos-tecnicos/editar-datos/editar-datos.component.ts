import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/ApiService';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ServicioInterno } from '../../../servicios-interno.service';
import { DetalleServicioService } from '../../detalle-servicio.service';
import { TiposDisplayTecnico } from '../tab-datos-tecnicos.component';

@Component({
  selector: 'app-editar-datos',
  templateUrl: './editar-datos.component.html',
  styleUrls: ['./editar-datos.component.scss']
})
export class EditarDatosComponent {

  editar = false;
  servicio: any;
  datosTecnico: any;
  tiposPlantacion: any[] = []
  listaPrioridades: any[] = []
  listadoHorarios: any[] = this.getHoras()
  abastecimientoAgua: any[] = [{ descripcion: 'SI', value: true }, { descripcion: 'NO', value: false }]
  minDate = new Date()
  backOffice = false;
  // controlName
  ctrl_typeCrop_id = 'typeCrop_id'
  ctrl_dateOfVisit = "dateOfVisit"
  ctrl_hourOfVisit = 'hourOfVisit'
  ctrl_withWater = "withWater"
  ctrl_hectare = "hectare"
  ctrl_priority = "priority"
  ctrl_recommendedTime = "recommendedTime"
  ctrl_recommendObservation = "recommendObservation"

  public form: FormGroup = new FormGroup({
    [this.ctrl_typeCrop_id]: new FormControl(null, Validators.required),
    [this.ctrl_dateOfVisit]: new FormControl(null, Validators.required),
    [this.ctrl_hourOfVisit]: new FormControl(null, Validators.required),
    [this.ctrl_withWater]: new FormControl(null, Validators.required),
    [this.ctrl_hectare]: new FormControl(null, Validators.required),
    [this.ctrl_priority]: new FormControl(null, Validators.required),
    [this.ctrl_recommendedTime]: new FormControl(null, Validators.required),
    [this.ctrl_recommendObservation]: new FormControl(null, Validators.required),
  })
  @Output() btnVolver = new EventEmitter<any>();

  constructor(private toastr: ToastrService,
    private serviciosService: ServiciosService,
    private apiService: ApiService,
    private servicioInterno : ServicioInterno,
    private detalleService: DetalleServicioService,) {

  }

  ngOnInit(): void {
    this.servicio = this.detalleService.servicio;
    this.backOffice =  this.servicioInterno.backOffice?.value
    this.datosTecnico = this.detalleService.datosTecnico
    this.setFormDatosTecnicos()
    this.getTiposPlantacion()
    this.getPrioridades()
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

  setFormDatosTecnicos() {
    this.form.patchValue(
      {
        typeCrop_id: this.datosTecnico?.typeCrop?.id,
        dateOfVisit: this.getTipoDate(this.datosTecnico?.dateOfVisit),
        withWater: this.datosTecnico?.withWater,
        hectare: this.datosTecnico?.hectare,
        priority: this.datosTecnico?.priority?.id,
        recommendedTime: this.datosTecnico?.recommendedTime,
        recommendObservation: this.datosTecnico?.recommendObservation
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

  getPrioridades() {
    this.serviciosService.getPriporidades().subscribe(
      data => {
        this.listaPrioridades = data.list[0];
      }
    )
  }

  getTiposPlantacion() {
    this.apiService.getAllTypeCropOperador().subscribe(
      (typeCrops: any) => {
        this.tiposPlantacion = typeCrops.map((crop: any) => ({
          id: crop.id,
          name: crop.name,
        }));
      },
      (error) => {
        console.error('Error al cargar los tipos de cultivo:', error);
      }
    );

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

    this.serviciosService.putDatosTecnico(this.servicio.id, body).subscribe(
      async (data: any) => {
        this.toastr.info(data?.message ?? 'Datos editados exitosamente', 'Éxito');
        await this.detalleService.getDatosTecnico()
        this.cancelar()
      },
      error => {
        this.toastr.info(error.error.message ?? 'Error editando datos', 'Información');
      }
    )

  }
}
