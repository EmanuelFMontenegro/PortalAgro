// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { MatSelectChange } from '@angular/material/select';
// import { Router } from '@angular/router';

// interface Filtro {
//   tipo: string;
//   valor?: string;
//   min?: number;
//   max?: number;
// }

// @Component({
//   selector: 'app-searchbar-prod',
//   templateUrl: './searchbar-prod.component.html',
// })
// export class SearchbarProdComponent {
//   @Output() clearFilter = new EventEmitter<any>();
//   @Output() filter = new EventEmitter<any>();
//   @Input() btnAdd?: string;
//   @Input() localidadesOptions: any[] = [];
//   @Input() placeholder?: string;
//   @Input() options: string[] = []; // Las opciones se pasan desde el componente padre

//   Buscar: string = '';
//   placeholderText: string = 'Buscar por . . .';
//   selectedValue: string | undefined;
//   mostrarInputNormal: boolean = true;
//   cultivos: string = '';
//   constructor(private router: Router) {}

//   ngOnInit(): void {
//     this.placeholderText = this.placeholder || 'Buscar por Localidad';
//     this.selectedValue = this.options.length > 0 ? this.options[0] : undefined; // Establecemos la opción predeterminada
//   }

//   addType(route: string) {
//     switch (this.btnAdd) {
//       case 'Chacras':
//         this.router.navigate(['/dashboard/chacras']);
//         break;
//       case 'Lotes':
//         this.router.navigate(['dashboard/cargar-lote'], {
//           state: { modoEdicion: false },
//         });
//         break;
//     }
//   }

//   aplicarFiltro(event: MatSelectChange) {
//     const filtros: {
//       [key: string]: {
//         placeholder: string;
//         mostrarInputNormal: boolean;
//         limpiarInput: boolean;
//       };
//     } = {
//       Localidad: {
//         placeholder: 'Buscar por Localidad',
//         mostrarInputNormal: false,
//         limpiarInput: false,
//       },
//       Cultivos: {
//         placeholder: 'Buscar por Plantación',
//         mostrarInputNormal: true,
//         limpiarInput: true,
//       },
//     };

//     const filtroSeleccionado = filtros[event.value];
//     if (filtroSeleccionado) {
//       this.placeholderText = filtroSeleccionado.placeholder;
//       this.mostrarInputNormal = filtroSeleccionado.mostrarInputNormal;

//       if (filtroSeleccionado.limpiarInput) {
//         this.limpiarTexto();
//       }
//     }
//   }

//   onFiltrar() {
//     let filtro: Filtro = { tipo: this.placeholderText };

//     switch (this.placeholderText) {
//       case 'Buscar por Localidad':
//         filtro['valor'] = this.Buscar;
//         break;
//       case 'Buscar por Plantación':
//         filtro['valor'] = this.cultivos;
//         break;
//     }

//     this.filter.emit(filtro);
//   }

//   limpiarTexto() {
//     this.Buscar = '';
//     this.clearFilter.emit();
//   }
// }
