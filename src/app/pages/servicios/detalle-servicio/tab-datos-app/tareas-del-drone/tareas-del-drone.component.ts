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
import { DetalleServicioService } from '../../detalle-servicio.service';
import { TiposDisplayTecnico } from '../../tab-datos-tecnicos/tab-datos-tecnicos.component';
import { TiposDisplayApp } from '../tab-datos-app.component';

@Component({
  selector: 'app-tareas-del-drone',
  templateUrl: './tareas-del-drone.component.html',
  styleUrls: ['./tareas-del-drone.component.scss']
})
export class TareasDelDroneComponent {

  editar = false;
  servicio: any;
  tareasDrone: any;
  listadoDrones: any[] = []
  listaInsumos: any[] = []
  listadoHorarios: any[] = this.getHoras()
  abastecimientoAgua: any[] = [{ descripcion: 'SI', value: true }, { descripcion: 'NO', value: false }]
  minDate = new Date()
  tareasDroneApp = false;
  mostrarListado = true;

  dataView = [
    {label: 'Insumo', field: 'productInput.name', tipoLabel: TipoLabel.span},
    {label: 'Hectareas', field:'hectare', tipoLabel: TipoLabel.span },
    {label: 'Hora de incio', field:'intHour', tipoLabel: TipoLabel.span },
    {label: 'Hora de fin', field:'endHour', tipoLabel: TipoLabel.span },
    {label: 'Observaciones', field:'observation', tipoLabel: TipoLabel.span },
    {label: 'Ver insumos', field: 'dashboard-backoffice/configuracion/insumo', tipoLabel: TipoLabel.botonVermas},
  ]

  // controlName
  ctrl_droneAssigned = 'droneAssigned'
  ctrl_productInput = 'productInput'
  ctrl_intHour = 'intHour'
  ctrl_endHour = 'endHour'
  ctrl_hectare = 'hectare'
  ctrl_observation = 'observation'

  public form: FormGroup = new FormGroup({
    [this.ctrl_droneAssigned]: new FormControl(null, Validators.required),
    [this.ctrl_productInput]: new FormControl(null, Validators.required),
    [this.ctrl_intHour]: new FormControl(null, Validators.required),
    [this.ctrl_hectare]: new FormControl(null, Validators.required),
    [this.ctrl_endHour]: new FormControl(''),
    [this.ctrl_observation]: new FormControl(''),
  })
  @Output() btnVolver = new EventEmitter<any>();

  constructor(private toastr: ToastrService,
    private serviciosService: ServiciosService,
    private dialog: MatDialog,
    private droneService:DronService,
    private detalleService: DetalleServicioService){
      this.tareasDroneApp = this.detalleService.permisos?.jobOperator?.WRITE ?? false
    }

  ngOnInit(): void {
    this.servicio = this.detalleService.servicio;
    this.getDatosTask()
    this.setMiniaturas()
  }

  setMiniaturas(){
    if(this.detalleService.permisos?.jobTechnical?.WRITE)
    this.dataView.push({label: 'Eliminar', field: 'id', tipoLabel: TipoLabel.botonEliminar})
   }

  async getDatosTask(){
    await this.getTaskDrone()
    this.getDrones()
    this.getInsumos()
    this.setFormTareaDrone()
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
  setTimeout(() => {
    console.log("los datos de la app", this.tareasDrone)
    this.form.patchValue(
      {
        droneAssigned: this.tareasDrone?.droneAssigned?.id,
        productInput: this.tareasDrone?.productInput?.id,
        intHour: this.getTipoDate(this.tareasDrone?.intHourt),
        endHour: this.tareasDrone?.endHour ? this.getTipoDate(this.tareasDrone?.endHour): '' ,
        hectare: this.tareasDrone?.hectare,
        observation: this.tareasDrone?.observation
      }
    )
  }, 2000);

    console.log(this.form.value)
 /*    this.form.disable() */
  }

  getTipoDate(fechaStr: string) {
    const formato = 'DD/MM/YYYY HH:mm';
    const fechaMoment = moment(fechaStr, formato);

    return (!fechaMoment.isValid()) ? null : fechaMoment.toDate();
  }

  cancelar() {
    this.form.disable()
    this.mostrarListado = true;
  }

  volver() {
    this.btnVolver.emit(TiposDisplayApp.app)
  }

  getInsumos() {
    this.serviciosService.getInsumosTecnico(this.servicio.id).subscribe(
      (data: any) => {
        console.log("lños insumos",data.list[0])
        this.listaInsumos = data.list[0];
      }
    )
  }

  openABM() {
    this.mostrarListado = false;
  }

  dialogConfirmacionEliminar(valor:any){
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

  eliminarInsumo(valor:any){
    this.serviciosService.deleteTareaDrone(this.servicio.id, valor).subscribe(
      (data:any )=>{
        this.toastr.info(data?.message ?? 'tarea eliminada exitosamente', 'Éxito');
        this.getInsumos()
      },
      error =>{
        this.toastr.info(error.error?.message ?? 'Error eliminando tarea', 'Información');
        console.log("ERROR ELIMINADO TAREA", error)
      }
    )
  }


  getTaskDrone() {
    return new Promise<any>((resolve)=>{
      this.serviciosService.getDronesTask(this.servicio.id).subscribe(
        ( drones: any) => {
          console.log("la tarea del dron",drones)
          if(drones.list.length) this.tareasDrone = drones.list[0]
          resolve(true)
        },
        (error) => {
          console.error('Error al cargar los tipos de cultivo:', error);
          resolve(false)
        }
      );
    })

  }

  getDrones(){
    this.droneService.getAll().subscribe(
      data =>{
        if(data.list.length) this.listadoDrones = data.list[0]
      })
  }

  aceptar() {

    if (this.form.invalid) {
      this.toastr.info('Faltan campos requeridos', 'Información');
      this.form.markAllAsTouched()
      return;
    }

    let body = this.form.getRawValue();
    if (!body.observation) body.observation = ''
    body.intHour = moment(body.intHour).format('DD/MM/YYYY HH:mm');
    if(body?.endHour){
      body.endHour = moment(body.endHour).format('DD/MM/YYYY HH:mm')
    }else{
      body.endHour = ''
    }

    if(this.tareasDrone?.id){
      this.putDroneTask(body);
    }else{
      this.postDroneTask(body);
    }
  }

  postDroneTask(body: any){
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

  putDroneTask(body:any){
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
}
