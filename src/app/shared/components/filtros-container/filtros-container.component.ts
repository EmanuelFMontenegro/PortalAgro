import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-filtros-container',
  templateUrl: './filtros-container.component.html',
  styleUrls: ['./filtros-container.component.sass']
})
export class FiltrosContainerComponent {
  @Input() options: { value: string, label: string }[] = [];
  @Output() selectionChange = new EventEmitter<string>();
  @Input() crearUsuariosRuta: string = '';

  selectedFilter: string = '';
  minHectareas?: number;
  maxHectareas?: number;
  nombreProductor?: string;
  nombreChacra?: string;
  localidadSeleccionada?: string;

  localidades = [
    { name: 'Localidad 1' },
    { name: 'Localidad 2' },
    { name: 'Localidad 3' }
  ];

  constructor(private router: Router) {}

  onSelectionChange(event: any) {
    this.selectedFilter = event.value;
    this.selectionChange.emit(this.selectedFilter);
  }

  limpiarTexto() {
    this.minHectareas = undefined;
    this.maxHectareas = undefined;
    this.nombreProductor = '';
    this.nombreChacra = '';
    this.localidadSeleccionada = '';
  }

  activarFiltro() {
    console.log({
      filtro: this.selectedFilter,
      minHectareas: this.minHectareas,
      maxHectareas: this.maxHectareas,
      nombreProductor: this.nombreProductor,
      nombreChacra: this.nombreChacra,
      localidadSeleccionada: this.localidadSeleccionada
    });
    // Aquí puedes agregar la lógica para aplicar el filtro
  }

  BtnNuevaChacra() {
    console.log('Volver al Inicio');
    // Lógica adicional para volver al inicio
  }

  BtnCrearUsuarios() {
    if (this.crearUsuariosRuta) {
      this.router.navigate([this.crearUsuariosRuta]);
    } else {
      console.error('Ruta para crear usuarios no especificada');
    }
    // Lógica adicional para la navegación o creación de usuarios
  }
}
