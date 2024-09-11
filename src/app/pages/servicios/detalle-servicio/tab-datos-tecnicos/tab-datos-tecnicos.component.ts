import { Component } from '@angular/core';
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

  constructor(  public detalleServicioService: DetalleServicioService,){
    this.detalleServicioService.getServicio();
    this.servicio = this.detalleServicioService.servicio;
  }

  ngOnInit(): void {
    this.recuperarDatosDelTecnico()
  }

  async recuperarDatosDelTecnico(){
   await this.detalleServicioService.getDatosTecnico()
     this.datosTecnico = this.detalleServicioService.datosTecnico
     console.log("lOS DATOS DEL TEC", this.datosTecnico)
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
    console.log(valor)
    this.display = valor;
  }

}
