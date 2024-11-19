import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../utils/utils.service';
import { TipoLabel, DataView } from '../miniatura-listado/miniatura.model';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  standalone: true,
  imports: [MatButtonModule, CommonModule, NgxPaginationModule],
})
export class CardComponent {
  totalItems: number = 0; // Total de elementos
  itemsPerPage: number = 6; // Elementos por página
  page: number = 1; // Página actual

  constructor(private utilService: UtilsService, private router: Router) {}

  @Input() typeCard: string = 'chacra'; // Tipo de tarjeta
  @Input() listado: any; // Listado de items a mostrar
  @Input() dataView: DataView[] | undefined; // configuracion para determinar que tipo de elemento mostrar por cada campo
  @Input() productor = false; // cambia el estilo de la miniatura si es productor
  @Output() btnEliminar = new EventEmitter<any>();
  @Output() btnEditarDevolverObjeto = new EventEmitter<any>();
  tipoImagen = TipoLabel.imagen;
  tipoTitulo = TipoLabel.titulo;
  tipoSubtitulo = TipoLabel.subtitulo;
  tipoSpan = TipoLabel.span;
  tipoIcon = TipoLabel.icon;
  tipoVerMas = TipoLabel.botonVermas;
  tipoVerMasWithoutParam = TipoLabel.botonVermasWithoutParam;
  tipoEditarWithParams = TipoLabel.botonEditarWithParams;
  tipoEditar = TipoLabel.botonEditar;
  tipoGeolocalizar = TipoLabel.botonGeo;
  tipoVerLote = TipoLabel.botonVerLote;
  tipoEditarDevolviendo = TipoLabel.botonEditarDevolverObjeto; // en lugar de redirigir devuelve el objeto
  tipoEliminar = TipoLabel.botonEliminar;


  ngOnInit(){ 
  }

  loadItems() {
    this.totalItems = this.listado.length; // Actualiza el total de elementos
  }
  eliminar(datoEliminar: any) { 
    this.btnEliminar.emit(datoEliminar);
  }
  onPageChange(page: number) {
    this.page = page; // Actualiza la página actual
    this.loadItems(); // Vuelve a cargar los elementos
  }
  EditarDelviendo(objeto: any) {
    this.btnEditarDevolverObjeto.emit(objeto);
  }
  verMas(data: any, key?: any, ruta?: any){
    console.log(data);
    // Guardar los datos del usuario en localStorage
    if(key) localStorage.setItem(key, JSON.stringify(data));

    // Navegar al componente perfil-productor
    if(ruta) this.router.navigate([`${ruta}/${data?.id}`]);
  }


  //NUEVAS FUNC

  verMasWithoutParams(data: any, key?: any, ruta?: any) {
    // Guardar los datos del usuario en localStorage
    const PersonId = data?.person_id;
    if (PersonId){ localStorage.setItem('idPerfilProd', JSON.stringify(PersonId));}
    if(key) localStorage.setItem(key, JSON.stringify(data));
    if(ruta) this.router.navigate([ruta]);
  }


  
  verMasWithParams(data: any, key?: any, ruta?: any) {
    // Guardar los datos del usuario en localStorage
   
    if (key) localStorage.setItem(key, JSON.stringify(data));
    if (ruta) {
      this.router.navigate([`${ruta}/${data?.id}`]);
    }
  }

  Editar(data: any, key?: any, ruta?: any) {
    // Guardar los datos del usuario en localStorage
    if (key) localStorage.setItem(key, JSON.stringify(data));
   
    // Navegar al componente perfil-productor
    if (ruta) this.router.navigate([`${ruta}`]);
  }

  EditarWithParams(data: any, key?: any, ruta?: any) {
     // Guardar los datos del usuario en localStorage
     if(key) localStorage.setItem(key, JSON.stringify(data));

     // Navegar al componente perfil-productor
     if(ruta) this.router.navigate([`${ruta}/${data?.id}`]);
  }


  editarDevolviendoObjeto(datoEditar: any) {
    this.btnEliminar.emit(datoEditar);
  }
  getValue(objeto: any, field: string) {
    return this.utilService.obtenerValor(objeto, field);
  }

  verGeo(data: any, key?: any, ruta?: any) {
    this.router.navigate([`/mapa/${data?.id}`]);
  }
  verLote(data: any, key?: any, ruta?: any) {
    this.router.navigate([`/lote/${data?.id}`]);
  }

  getCardClass() {
    switch (this.typeCard) {
      case 'chacra':
        return 'cardContainerNoCentered';
      case 'productor':
        return 'cardContainerNoCenteredProductor';
      case 'lote':
        return 'cardContainerNoCenteredLote';
      default:
        return 'cardContainerNoCentered';
    }
  }

  getItemClass() {
    switch (this.typeCard) {
      case 'chacra':
        return 'cardCustomized';
      case 'productor':
        return 'ProductorCard';
      case 'lote':
        return 'LoteCard';
      default:
        return 'cardCustomized';
    }
  }

  getImageClass() {
    switch (this.typeCard) {
      case 'chacra':
        return 'cardCustomized-img';
      case 'productor':
        return 'ProductorCard-img';
      case 'lote':
        return 'LoteCard-img';
      default:
        return 'cardCustomized-img';
    }
  }

  getHeaderClass() {
    switch (this.typeCard) {
      case 'chacra':
        return 'cardCustomized-header';
      case 'productor':
        return 'ProductorCard-header';
      case 'lote':
        return 'LoteCard-header';
      default:
        return 'cardCustomized-header';
    }
  }

  getButtonClass() {
    switch (this.typeCard) {
      case 'chacra':
        return 'cardCustomized-buttons';
      case 'productor':
        return 'cardCustomized-buttons';
      case 'lote':
        return 'LoteCard-buttons';
      default:
        return 'cardCustomized-buttons';
    }
  }
}
