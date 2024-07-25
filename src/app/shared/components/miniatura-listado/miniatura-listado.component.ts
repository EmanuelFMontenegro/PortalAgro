import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../utils/utils.service';

import { TipoLabel, DataView } from './miniatura.model';

@Component({
  selector: 'miniatura',
  templateUrl: './miniatura-listado.component.html',
  styleUrls: ['./miniatura-listado.component.sass']
})
export class MiniaturaListadoComponent {

  constructor(private utilService: UtilsService,
              private router: Router){}


  @Input() listado: any // Listado de items a mostrar
  @Input() dataView: DataView [] | undefined // configuracion para determinar que tipo de elemento mostrar por cada campo
  @Input() productor = false; // cambia el estilo de la miniatura si es productor

  tipoImagen = TipoLabel.imagen
  tipoTitulo = TipoLabel.titulo
  tipoSubtitulo = TipoLabel.subtitulo
  tipoSpan = TipoLabel.span
  tipoIcon = TipoLabel.icon
  tipoVerMas = TipoLabel.botonVermas
  tipoEditar = TipoLabel.botonEditar



  verMas(data: any, key?: any, ruta?: any){
    // Guardar los datos del usuario en localStorage
    if(key) localStorage.setItem(key, JSON.stringify(data));

    // Navegar al componente perfil-productor
    if(ruta) this.router.navigate([`${ruta}/${data?.id}`]);
  }
  
  Editar(data: any, key?: any, ruta?: any){
    // Guardar los datos del usuario en localStorage
    if(key) localStorage.setItem(key, JSON.stringify(data));

    // Navegar al componente perfil-productor
    if(ruta) this.router.navigate([`${ruta}/${data?.id}`]);
  }
  getValue(objeto:any, field: string){
    return this.utilService.obtenerValor(objeto,field)
  }
}
