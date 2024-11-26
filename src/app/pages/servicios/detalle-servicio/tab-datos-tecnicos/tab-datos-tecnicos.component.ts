import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PermisosUsuario } from 'src/app/models/permisos.model';
import { AuthService } from 'src/app/services/AuthService';
import { ServicioInterno } from '../../servicios-interno.service';
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
  editarDatosTecnicos = false;
  backOffice = false;

  constructor( public detalleServicioService: DetalleServicioService,
    private servicioInterno : ServicioInterno,
    private authService: AuthService){
    this.detalleServicioService.getServicio();
    this.servicio = this.detalleServicioService.servicio;
  }

  ngOnInit(): void {
    this.backOffice =  this.servicioInterno.backOffice?.value
    this.recuperarDatosDelTecnico()
    this.editarDatosTecnicos = this.detalleServicioService.permisos?.jobTechnical?.WRITE ?? false;
  }

  async recuperarDatosDelTecnico(){
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
