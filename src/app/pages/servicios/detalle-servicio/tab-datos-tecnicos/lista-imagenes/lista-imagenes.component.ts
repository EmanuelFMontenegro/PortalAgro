import { Component, EventEmitter, Output } from '@angular/core';
import { TiposDisplayTecnico } from '../tab-datos-tecnicos.component';

@Component({
  selector: 'app-lista-imagenes',
  templateUrl: './lista-imagenes.component.html',
  styleUrls: ['./lista-imagenes.component.scss']
})
export class ListaImagenesComponent {

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
