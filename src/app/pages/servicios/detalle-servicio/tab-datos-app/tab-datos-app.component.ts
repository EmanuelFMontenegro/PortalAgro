import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Piloto } from 'src/app/models/servicios.models';
import { DetalleServicioService } from '../detalle-servicio.service';

export enum TiposDisplayApp{
  app = 0,
  insumos = 1,
  imagenes = 2,
  editarDatos = 3,
  tareasDrone = 4
}
@Component({
  selector: 'app-tab-datos-app',
  templateUrl: './tab-datos-app.component.html',
  styleUrls: ['./tab-datos-app.component.scss']
})
export class TabDatosAppComponent {

  servicio: any
  datosApp: Piloto | undefined;
  display = TiposDisplayApp.app;
  tipo = TiposDisplayApp;
  displayApp= TiposDisplayApp.app
  ctrlObservaciones = new FormControl('observaciones', null)
  subscripcion = new Subscription()

  constructor( public detalleServicioService: DetalleServicioService,){
    this.detalleServicioService.getServicio();
    this.servicio = this.detalleServicioService.servicio;
  }

  ngOnInit(): void {
    this.recuperarDatosDeApp()
  }

  async recuperarDatosDeApp(){
   await this.detalleServicioService.getDatosApp()
     this.datosApp = this.detalleServicioService.datosPiloto
     this.ctrlObservaciones.setValue(this.datosApp?.observation ?? '')
     this.ctrlObservaciones.disable()
  }

  mostrarInsumos(){
     this.display = TiposDisplayApp.insumos
  }

  mostrarImagenes(){
    this.display = TiposDisplayApp.imagenes
  }

  editarDatos(){
    this.display = TiposDisplayApp.editarDatos
  }

  tareasDrone(){
    this.display = TiposDisplayApp.tareasDrone
  }

  setBtnVolver(valor: any){
    this.display = valor;
    this.datosApp = this.detalleServicioService.datosPiloto
    this.ctrlObservaciones.setValue(this.datosApp?.observation ?? '')
  }

  ngOnDestroy(): void {

  }

}
