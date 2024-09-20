import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DetalleServicioService } from '../detalle-servicio.service';


export enum TiposDisplayTecnico{
  tecnico = 0,
  insumos = 1,
  imagenes = 2,
  editarDatos = 3,
}
@Component({
  selector: 'app-tab-datos-tecnicos',
  templateUrl: './tab-datos-tecnicos.component.html',
  styleUrls: ['./tab-datos-tecnicos.component.scss']
})
export class TabDatosTecnicosComponent {

  servicio: any
  datosTecnico: any;
  display = TiposDisplayTecnico.tecnico;
  tipo = TiposDisplayTecnico;
  displayTecnico = TiposDisplayTecnico.tecnico
  ctrlObservaciones = new FormControl('observaciones', null)
  subscripcion = new Subscription()

  constructor( public detalleServicioService: DetalleServicioService,){
    this.detalleServicioService.getServicio();
    this.servicio = this.detalleServicioService.servicio;
  }

  ngOnInit(): void {
    this.recuperarDatosDelTecnico()
  }

  async recuperarDatosDelTecnico(){
   await this.detalleServicioService.getDatosTecnico()
     this.datosTecnico = this.detalleServicioService?.datosTecnico
     this.ctrlObservaciones.setValue(this.datosTecnico?.recommendObservation)
     this.ctrlObservaciones.disable()
  }

  mostrarInsumos(){
     this.display = TiposDisplayTecnico.insumos
  }

  mostrarImagenes(){
    this.display = TiposDisplayTecnico.imagenes
  }

  editarDatos(){
    this.display = TiposDisplayTecnico.editarDatos
  }

  setBtnVolver(valor: any){
    this.display = valor;
    this.datosTecnico = this.detalleServicioService?.datosTecnico
    this.ctrlObservaciones.setValue(this.datosTecnico?.recommendObservation)
  }

  ngOnDestroy(): void {

  }

}
