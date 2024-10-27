import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';

interface Filtro {
  tipo: string;
  valor?: string;
  min?: number;
  max?: number;
}

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
})
export class SearchbarComponent {
  @Output() clearFilter = new EventEmitter<any>();
  @Output() filter = new EventEmitter<any>();
  @Input() btnAdd?: string;
  @Input() options?: string[] = [];
  @Input() localidadesOptions: any[] = [];
  @Input() placeholder?: string;
  Buscar: string = '';
  placeholderText: string = 'Buscar por . . .';
  selectedValue: string | undefined;
  mostrarInputNormal: boolean = true;
  minHectareas: number | undefined;
  maxHectareas: number | undefined;
  nombreChacra: string = '';
  nombreProductor: string = '';
  apellidoProductor: string = '';
  plantaciones: string = '';
  constructor(private router: Router) {}

  ngOnInit(): void {
    //falta hacer dinamico el placeholder

    this.placeholderText = this.placeholder
      ? this.placeholder
      : 'Buscar por Productor';
    this.setOpcionPredeterminada();
  }

  setOpcionPredeterminada() {
    if (this.options && this.options.length > 0) {
      this.selectedValue = this.options[0];
      this.placeholderText;
    } else {
      // Manejo del caso cuando no hay opciones disponibles
      this.selectedValue = undefined;
      console.warn('No hay opciones disponibles para seleccionar.');
    }
  }
  addType(route: string) {
    switch (this.btnAdd) {
      case 'Chacras':
        this.router.navigate(['/dashboard/campo']);
        break;
      case 'Productor':
        this.router.navigate(['dashboard-backoffice/nuevo-usuario']);
        break;
      case 'Chacras-p':
        this.router.navigate(['dashboard-backoffice/cargar-chacras']);
        break;
      case 'Lotes':
        this.router.navigate(['dashboard/cargar-lote'], {
          state: { modoEdicion: false },
        });
        break;
    }
  }

  aplicarFiltro(event: MatSelectChange) {
    const filtros: {
      [key: string]: {
        placeholder: string;
        mostrarInputNormal: boolean;
        limpiarInput: boolean;
      };
    } = {
      Localidad: {
        placeholder: 'Buscar por Localidad',
        mostrarInputNormal: false,
        limpiarInput: false,
      },
      Productor: {
        placeholder: 'Buscar por Productor',
        mostrarInputNormal: true,
        limpiarInput: true,
      },
      'Nombre de Chacra': {
        placeholder: 'Buscar por Nombre de Chacra',
        mostrarInputNormal: true,
        limpiarInput: true,
      },
      NombreProductor: {
        placeholder: 'Buscar por Nombre',
        mostrarInputNormal: true,
        limpiarInput: true,
      },
      ApellidoProductor: {
        placeholder: 'Buscar por Apellido',
        mostrarInputNormal: true,
        limpiarInput: true,
      },
      Hectareas: {
        placeholder: 'Buscar por Hectáreas',
        mostrarInputNormal: false,
        limpiarInput: true,
      },
      Plantaciones: {
        placeholder: 'Buscar por Plantaciones',
        mostrarInputNormal: true,
        limpiarInput: true,
      },
    };
    const filtroSeleccionado = filtros[event.value];
    this.placeholderText = filtroSeleccionado.placeholder;
    this.mostrarInputNormal = filtroSeleccionado.mostrarInputNormal;

    if (filtroSeleccionado.limpiarInput) {
      this.limpiarInputs();
    }
  }

  onFiltrar() {
    let filtro: Filtro = { tipo: this.placeholderText };
    switch (this.placeholderText) {
      case 'Buscar por Localidad':
        filtro['valor'] = this.Buscar;
        break;
      case 'Buscar por Productor':
        filtro['valor'] = this.nombreProductor;
        break;
      case 'Buscar por Nombre':
        filtro['valor'] = this.nombreProductor;
        break;
      case 'Buscar por Apellido':
        filtro['valor'] = this.apellidoProductor;
        break;
      case 'Buscar por Nombre de Chacra':
        filtro['valor'] = this.nombreChacra;
        break;
      case 'Buscar por Hectáreas':
        filtro['min'] = this.minHectareas;
        filtro['max'] = this.maxHectareas;
        break;
      case 'Buscar por Plantaciones':
        filtro['valor'] = this.plantaciones;
        break;
    }

    this.filter.emit(filtro);
  }

  limpiarInputs() {
    this.nombreProductor = '';
    this.nombreChacra = '';
  }

  limpiarTexto() {
    this.Buscar = '';
    this.nombreChacra = '';
    this.nombreProductor = '';
    this.apellidoProductor = '';
    this.plantaciones = '';
    this.minHectareas = undefined;
    this.maxHectareas = undefined;
    this.clearFilter.emit();
  }
}
