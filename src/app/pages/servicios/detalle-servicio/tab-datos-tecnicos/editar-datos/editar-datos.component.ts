import { Component, EventEmitter, Output } from '@angular/core';
import { TiposDisplayTecnico } from '../tab-datos-tecnicos.component';

@Component({
  selector: 'app-editar-datos',
  templateUrl: './editar-datos.component.html',
  styleUrls: ['./editar-datos.component.scss']
})
export class EditarDatosComponent {

  mostrarListado = true;
  @Output() btnVolver = new EventEmitter<any>();

  constructor(){

  }

  ngOnInit(): void {

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

  }
}
