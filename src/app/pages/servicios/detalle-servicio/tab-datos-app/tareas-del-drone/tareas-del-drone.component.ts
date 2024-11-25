import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from 'src/app/pages/dashboard/dialog/dialog.component';
import { ApiService } from 'src/app/services/ApiService';
import { DronService } from 'src/app/services/dron.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { TipoLabel } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { ServicioInterno } from '../../../servicios-interno.service';
import { DetalleServicioService } from '../../detalle-servicio.service';
import { TiposDisplayTecnico } from '../../tab-datos-tecnicos/tab-datos-tecnicos.component';
import { TiposDisplayApp } from '../tab-datos-app.component';

@Component({
  selector: 'app-tareas-del-drone',
  templateUrl: './tareas-del-drone.component.html',
  styleUrls: ['./tareas-del-drone.component.scss']
})
export class TareasDelDroneComponent {
  @Output() btnVolver = new EventEmitter<any>();

  editar = false;
  servicio: any;
  tareasDrone: any;
  listadoDrones: any[] = []
  listaInsumos: any[] = []
  listadoHorarios: any[] = this.getHoras()
  abastecimientoAgua: any[] = [{ descripcion: 'SI', value: true }, { descripcion: 'NO', value: false }]
  tareasDroneApp = false;
  mostrarListado = true;
  errorFechas = false;
  tareasOriginales: any[] = []
  tareaSeleccionada: any;

  dataView: any = [
    { label: 'Insumo', field: 'productInput.name', tipoLabel: TipoLabel.span },
    { label: 'Hectareas', field: 'hectare', tipoLabel: TipoLabel.span },
    { label: 'Hora de incio', field: 'intHour', tipoLabel: TipoLabel.span },
    { label: 'Hora de fin', field: 'endHour', tipoLabel: TipoLabel.span },
    { label: 'Observaciones', field: 'observation', tipoLabel: TipoLabel.span },
    { label: null, field: null, tipoLabel: TipoLabel.botonVermas },
  ]

  // controlName
  ctrl_droneAssigned = 'droneAssigned'
  ctrl_productInput = 'productInput'
  ctrl_intDate = 'intDate'
  ctrl_intHour = 'intHour'
  ctrl_endDate = 'endDate'
  ctrl_endHour = 'endHour'
  ctrl_hectare = 'hectare'
  ctrl_observation = 'observation'

  public form: FormGroup = new FormGroup({
    [this.ctrl_droneAssigned]: new FormControl(null, Validators.required),
    [this.ctrl_productInput]: new FormControl(null, Validators.required),
    [this.ctrl_intDate]: new FormControl(null, Validators.required),
    [this.ctrl_intHour]: new FormControl(null, Validators.required),
    [this.ctrl_hectare]: new FormControl(null, Validators.required),
    [this.ctrl_endDate]: new FormControl(''),
    [this.ctrl_endHour]: new FormControl(''),
    [this.ctrl_observation]: new FormControl(''),
  })
  backOffice = false;
  horaInicio = '';
  horaFin = '';

  constructor(private toastr: ToastrService,
    private serviciosService: ServiciosService,
    private dialog: MatDialog,
    private droneService: DronService,
    private servicioInterno: ServicioInterno,
    private detalleService: DetalleServicioService) {
    this.tareasDroneApp = this.detalleService.permisos?.jobOperator?.WRITE || this.detalleService.permisos?.jobOperator?.WRITE_MY ? true : false;
  }

  ngOnInit(): void {
    this.backOffice = this.servicioInterno.backOffice?.value
    this.servicio = this.detalleService.servicio;
    this.getDatosTask()
    this.setMiniaturas()
    this.controlarFechas()
  }

  controlarFechas() {
    this.form.valueChanges.subscribe(
      data => this.fechaFinalMayor()
    )
  }

  setMiniaturas() {
    if (this.detalleService.permisos?.jobTechnical?.WRITE)
      this.dataView.push({ label: 'Eliminar', field: 'id', tipoLabel: TipoLabel.botonEliminar })
  }

  async getDatosTask() {
    await this.getTaskDrone()
    if (this.tareasDroneApp) this.getDrones()
    this.getInsumos()
  }

  getHoras() {
    let horas: string[] = [];

    for (let i = 0; i < 24; i++) {
      const horaFormateada = i.toString().padStart(2, '0') + ':00';
      horas.push(horaFormateada);
    }

    return horas;
  }

  setFormTareaDrone() {
    this.form.patchValue(
      {
        droneAssigned: this.tareasDroneApp ? this.tareaSeleccionada?.droneAssigned?.id : this.tareaSeleccionada?.droneAssigned?.nickname,
        productInput: this.tareaSeleccionada?.productInput?.id,
        hectare: this.tareaSeleccionada?.hectare,
        observation: this.tareaSeleccionada?.observation
      }
    )

    this.form.controls[this.ctrl_intDate].setValue(this.getTipoDate(this.tareaSeleccionada?.intHour, this.ctrl_intHour))
    this.form.controls[this.ctrl_endDate].setValue(this.tareaSeleccionada?.endHour ? this.getTipoDate(this.tareaSeleccionada?.endHour, this.ctrl_endHour) : '',)

  }

  seleccionTarea(tarea: any) {
    console.log(tarea)
    this.tareaSeleccionada = tarea;
    this.mostrarListado = false;
    this.setFormTareaDrone();
    this.form.disable()
  }

  getTipoDate(fechaStr: string, ctrl_hora: any) {
    const formato = 'DD/MM/YYYY HH:mm';
    const fechaMoment = moment(fechaStr, formato);

    let horaYMinutos = fechaMoment.format('HH:mm');
    if (horaYMinutos !== 'Invalid date' && ctrl_hora) {
      this.form.controls[ctrl_hora].setValue(horaYMinutos)
    }

    fechaMoment.toDate()

    return (!fechaMoment.isValid()) ? null : fechaMoment.toDate();
  }

  async cancelar() {
    this.mostrarListado = true;
    this.editar = false;
    this.form.disable()
    await this.getTaskDrone()
  }

  editarTarea() {
    this.form.enable()
    this.setFormTareaDrone()
    this.editar = true;
  }

  volver() {
    this.form.disable()
    this.btnVolver.emit(TiposDisplayApp.app)
  }

  getInsumos() {
    this.serviciosService.getInsumosTecnico(this.servicio.id).subscribe(
      (data: any) => {
        console.log("lños insumos", data.list[0])
        this.listaInsumos = data.list[0];
      }
    )
  }

  openABM() {
    this.tareaSeleccionada = null
    this.mostrarListado = false;
    this.editar = true;
    this.setFormTareaDrone()
  }

  dialogConfirmacionEliminar(valor: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        titulo: 'Eliminar Tarea',
        message: `¿Desea eliminar la tarea?`,
        showCancel: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) this.eliminarInsumo(valor)
    });
  }

  eliminarInsumo(valor: any) {
    this.serviciosService.deleteTareaDrone(this.servicio.id, valor).subscribe(
      async (data: any) => {
        this.toastr.info(data?.message ?? 'tarea eliminada exitosamente', 'Éxito');
        await this.getTaskDrone()
      },
      error => {
        this.toastr.info(error.error?.message ?? 'Error eliminando tarea', 'Información');
        console.log("ERROR ELIMINADO TAREA", error)
      }
    )
  }


  getTaskDrone() {
    return new Promise<any>((resolve) => {
      this.serviciosService.getDronesTask(this.servicio.id).subscribe(
        (drones: any) => {
          if (drones.list.length) {
            this.tareasOriginales = drones.list[0]
            this.tareasDrone = drones.list[0]
          }
          console.log("la tarea del dron", this.tareasDrone)
          resolve(true)
        },
        (error) => {
          console.error('Error al cargar los tipos de cultivo:', error);
          resolve(false)
        }
      );
    })

  }

  getDrones() {
    this.droneService.getAll().subscribe(
      data => {
        if (data.list.length) { this.listadoDrones = data.list[0] }
      })
  }

  dialogoSeleccionarDrone(drone: any) {



  }

  aceptar() {

    if (this.form.invalid || this.errorFechas) {
      this.toastr.info('Faltan campos requeridos', 'Información');
      this.form.markAllAsTouched()
      return;
    }

    let body = this.form.getRawValue();

    // HORA DE INICIO
    if (!body.observation) body.observation = ''
    let horaInicio = body.intHour
    body.intHour = moment(body.intDate).format('DD/MM/YYYY') + ' ' + horaInicio;


    // HORA DE FIN
    if (body?.endHour && body.endDate) {
      let horaFin = body?.endHour;
      body.endHour = moment(body.endDate).format('DD/MM/YYYY') + ' ' + horaFin;
    } else {
      body.endHour = ''
    }


    delete body.intDate
    delete body.endDate

    console.log(body)

    if (this.tareaSeleccionada?.id) {
      this.putDroneTask(body);
    } else {
      this.postDroneTask(body);
    }
  }

  postDroneTask(body: any) {
    this.serviciosService.postDroneTask(this.servicio.id, body).subscribe(
      async (data: any) => {
        this.toastr.info(data?.message ?? 'Datos cargados exitosamente', 'Éxito');
        await this.detalleService.getDatosApp()
        this.cancelar()
      },
      error => {
        this.toastr.info(error.error.message ?? 'Error cargando datos', 'Información');
      }
    )
  }

  putDroneTask(body: any) {
    this.serviciosService.putDroneTask(this.servicio.id, body, this.tareasDrone.id).subscribe(
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

  /** Controla que la fecha de fin no sea mayor a la fecha de inicio */
  fechaFinalMayor() {
    let fechaInicio = this.form.controls[this.ctrl_intDate]?.value;
    let fechaFin = this.form.controls[this.ctrl_endDate]?.value;
    let horaInicio = this.form.controls[this.ctrl_intHour]?.value;
    let horaFin = this.form.controls[this.ctrl_endHour]?.value;

    this.errorFechas = false;
    if (fechaFin && fechaInicio && horaFin && horaInicio) {
      let inicia = moment(fechaInicio).format('DD/MM/YYYY') + ' ' + horaInicio;
      let termina = moment(fechaFin).format('DD/MM/YYYY') + ' ' + horaFin;

      // Usar moment para comparar las fechas completas
      let fechaIniciaMoment = moment(inicia, 'DD/MM/YYYY HH:mm');
      let fechaTerminaMoment = moment(termina, 'DD/MM/YYYY HH:mm');

      // Comparar las fechas
      if (fechaIniciaMoment.isBefore(fechaTerminaMoment)) {
        this.errorFechas = false;  // La fecha de inicio es antes que la de fin
      } else {
        this.errorFechas = true;  // La fecha de inicio es después de la fecha de fin
      }
    }

  }
}
