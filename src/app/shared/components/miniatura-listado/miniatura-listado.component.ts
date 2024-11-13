import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../utils/utils.service';

import { TipoLabel, DataView } from './miniatura.model';

@Component({
  selector: 'miniatura',
  templateUrl: './miniatura-listado.component.html',
  styleUrls: ['./miniatura-listado.component.sass'],
})
export class MiniaturaListadoComponent {

  constructor(private utilService: UtilsService,
              private router: Router){}
  // Variables para paginación
  page: number = 1; // Página inicial

  @Input() listado: any // Listado de items a mostrar
  @Input() dataView: DataView [] | undefined // configuracion para determinar que tipo de elemento mostrar por cada campo
  @Input() productor = false; // cambia el estilo de la miniatura si es productor
  @Output() btnEliminar = new EventEmitter<any>();
  @Output() btnEditarDevolverObjeto = new EventEmitter<any>();
  @Output() btnVerMasAccion = new EventEmitter<any>();

  tipoImagen = TipoLabel.imagen
  tipoTitulo = TipoLabel.titulo
  tipoSubtitulo = TipoLabel.subtitulo
  tipoSpan = TipoLabel.span
  tipoIcon = TipoLabel.icon
  tipoVerMas = TipoLabel.botonVermas
  tipoEditar = TipoLabel.botonEditar
  tipoGeolocalizar = TipoLabel.botonGeo
  tipoVerLote = TipoLabel.botonVerLote
  tipoEditarDevolviendo = TipoLabel.botonEditarDevolverObjeto // en lugar de redirigir devuelve el objeto
  tipoEliminar = TipoLabel.botonEliminar

  eliminar(datoEliminar: any){
    this.btnEliminar.emit(datoEliminar)
  }

  EditarDelviendo(objeto: any){
   this.btnEditarDevolverObjeto.emit(objeto)
  }

  verMas(data: any, key?: any, ruta?: any){
    // Guardar los datos del usuario en localStorage
    if(key) localStorage.setItem(key, JSON.stringify(data));

    // Navegar al componente perfil-productor
    if(ruta) this.router.navigate([`${ruta}/${data?.id}`]);

    // Envia una señal de que el boton fue pulsado y desde el front se pueda realizar una accion
    this.btnVerMasAccion.emit(data)
  }


  Editar(data: any, key?: any, ruta?: any){
    // Guardar los datos del usuario en localStorage
    if(key) localStorage.setItem(key, JSON.stringify(data));

    // Navegar al componente perfil-productor
    if(ruta) this.router.navigate([`${ruta}/${data?.id}`]);
  }

  editarDevolviendoObjeto(datoEditar: any){
    this.btnEliminar.emit(datoEditar)
  }
  getValue(objeto:any, field: string){
    return this.utilService.obtenerValor(objeto,field)
  }

  verGeo(data: any, key?: any, ruta?: any){
    this.router.navigate([`/mapa/${data?.id}`]);
  }
  verLote(data: any, key?: any, ruta?: any){
    this.router.navigate([`/lote/${data?.id}`]);
  }
}
