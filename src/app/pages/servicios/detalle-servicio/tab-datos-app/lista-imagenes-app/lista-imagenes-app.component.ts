import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InsumoService } from 'src/app/services/insumo.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { TipoLabel } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { ServicioInterno } from '../../../servicios-interno.service';
import { DetalleServicioService } from '../../detalle-servicio.service';
import { TiposDisplayApp } from '../tab-datos-app.component';

@Component({
  selector: 'app-lista-imagenes-app',
  templateUrl: './lista-imagenes-app.component.html',
  styleUrls: ['./lista-imagenes-app.component.scss']
})
export class ListaImagenesAppComponent {


  mostrarListado = true;
  listadoTiposInsumos: any;
  listadoImagenes: any;
  servicio: any;
  backOffice = false;

  // controlName
  ctrlTitle = "title"
  ctrlDescription = "description"
  ctrlimageJob = "imageJob"

  public form: FormGroup = new FormGroup({
    [this.ctrlTitle]: new FormControl(null, Validators.required),
    [this.ctrlDescription]: new FormControl(null),
    [this.ctrlimageJob]: new FormControl(null, Validators.required),
  })

  dataView = [
    { label: 'Titulo', field: 'title', tipoLabel: TipoLabel.span },
    { label: 'Descripción', field: 'description', tipoLabel: TipoLabel.span },
    // { label: 'Ver Imágenes', field: 'dashboard-backoffice/configuracion/insumo', tipoLabel: TipoLabel.botonVermas },
  ]

  @Output() btnVolver = new EventEmitter<any>();
  puedeSubirImagenes = false

  constructor(
    private toastr: ToastrService,
    private serviciosService: ServiciosService,
    private detalleService: DetalleServicioService,
    private servicioInterno : ServicioInterno,
    private insumosService: InsumoService
  ) {

  }

  ngOnInit(): void {
    this.backOffice =  this.servicioInterno.backOffice?.value
    this.servicio = this.detalleService.servicio;
    this.getImagenes()
    this.setMiniaturas();
  }

  setMiniaturas(){
    if(this.detalleService.permisos?.jobOperator?.WRITE || this.detalleService.permisos?.jobOperator?.WRITE_MY){
      this.puedeSubirImagenes = true;
      this.dataView.push({ label: 'Eliminar', field: 'id', tipoLabel: TipoLabel.botonEliminar })
    }
   }

  disabledUpload(){

  }

  recibirArchivo(file: any): void {
    console.log(file)
      this.form.controls[this.ctrlimageJob].setValue(file)
  }

  getImagenes() {
    this.serviciosService.getImagenesPiloto(this.servicio.id).subscribe(
      (data: any) => {
        this.listadoImagenes = data.list[0]
      },
      error => {

      }
    )
  }

  eliminarImagen(valor: any) {

    this.serviciosService.deleteImagenPiloto(this.servicio.id, valor).subscribe(
      (data: any) => {
        this.toastr.info(data?.message ?? 'Imagen eliminada exitosamente', 'Éxito');
        this.getImagenes()
      },
      error => {
        this.toastr.info(error.error?.message ?? 'Error eliminando imagen', 'Información');
        console.log("ERROR ELIMINADO", error)
      }
    )
  }

  adjuntarImagen(){

  }

  openABM() {
    this.mostrarListado = false;
  }

  cancelar() {
    this.mostrarListado = true;
  }

  volver() {
    this.btnVolver.emit(TiposDisplayApp.app)
  }

  aceptar() {

    if (this.form.invalid) {
      this.toastr.info('Faltan campos requeridos', 'Información');
      this.form.markAllAsTouched()
      return;
    }


    this.serviciosService.postImagenPiloto(this.servicio.id, this.form.getRawValue()).subscribe(
      (data: any) => {
        this.toastr.info(data?.message ?? 'Imagen cargada exitosamente', 'Éxito');
        this.cancelar()
        this.getImagenes()
      },
      error => {
        this.toastr.info(error.error.message ?? 'Error agregando imagen', 'Información');
      }
    )

  }


}
