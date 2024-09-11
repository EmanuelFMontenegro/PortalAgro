import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InsumoService } from 'src/app/services/insumo.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { TipoLabel } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { DetalleServicioService } from '../../detalle-servicio.service';
import { TiposDisplayTecnico } from '../tab-datos-tecnicos.component';

@Component({
  selector: 'app-lista-insumos',
  templateUrl: './lista-insumos.component.html',
  styleUrls: ['./lista-insumos.component.scss']
})
export class ListaInsumosComponent {

  mostrarListado = true;
  listadoTiposInsumos: any;
  listadoInsumos:any;
  servicio: any;

  // controlName
  ctrlProducto = "productInput"
  ctrlDosis = "doseToBeApplied"
  ctrlHectarea = "hectaresPerLiter"

  public form: FormGroup = new FormGroup({
    [this.ctrlProducto]: new FormControl(null, Validators.required),
    [this.ctrlDosis]: new FormControl(null, Validators.required),
    [this.ctrlHectarea]: new FormControl(null, Validators.required),
  })

  dataView = [
    {label: 'Nombre', field: 'productInput.name', tipoLabel: TipoLabel.span},
    {label: 'Dosis', field:'doseToBeApplied', tipoLabel: TipoLabel.span },
    {label: 'Litros por hectárea', field:'hectaresPerLiter', tipoLabel: TipoLabel.span },
    {label: 'Ver insumos', field: 'dashboard-backoffice/configuracion/insumo', tipoLabel: TipoLabel.botonVermas},
  ]

  @Output() btnVolver = new EventEmitter<any>();

  constructor(
    private toastr: ToastrService,
    private serviciosService: ServiciosService,
    private detalleService: DetalleServicioService,
    private insumosService: InsumoService
  ){

  }

  ngOnInit(): void {
    this.servicio = this.detalleService.servicio;
    this.getInsumos()
    this.getTiposInsumos()
  }

  getInsumos(){
     this.serviciosService.getInsumosTecnico(this.servicio.id).subscribe(
      (data:any) =>{
        this.listadoInsumos = data.list[0]
        console.log(data)
      },
      error =>{

      }
     )
  }

  getTiposInsumos(){
   this.insumosService.getAll().subscribe(
    data => {
      this.listadoTiposInsumos = data.list[0]
      console.log(data)
    },
    error => {}
   )
  }

  openABM(){
    this.mostrarListado = false;
  }

  cancelar(){
     this.mostrarListado = true;
  }

  volver(){
    this.btnVolver.emit(TiposDisplayTecnico.tecnico)
  }

  aceptar(){

    if(this.form.invalid){
      this.toastr.info('Faltan campos requeridos', 'Información');
      this.form.markAllAsTouched()
      return;
    }

    this.serviciosService.postDatosTecnicos(this.servicio.id,this.form.getRawValue()).subscribe(
      (data: any) => {
        this.toastr.info(data?.message ?? 'Insumo cargado exitosamente', 'Éxito');
        this.cancelar()
        this.getInsumos()
      },
      error => {
      this.toastr.info(error.error.message ?? 'Error agregando insumo', 'Información');
      }
    )

  }

}
