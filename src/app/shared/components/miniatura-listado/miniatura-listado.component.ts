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

  // ENTRADA
  @Input() listado: any
  @Input() dataView: DataView [] | undefined

  tipoImagen = TipoLabel.imagen
  tipoTitulo = TipoLabel.titulo
  tipoSubtitulo = TipoLabel.subtitulo
  tipoSpan = TipoLabel.span
  tipoIcon = TipoLabel.icon
  tipoVerMas = TipoLabel.botonVermas


  verMas(data: any, key?: any, ruta?: any){
    // Guardar los datos del usuario en localStorage
    if(key) localStorage.setItem(key, JSON.stringify(data));

    // Navegar al componente perfil-productor
    if(ruta) this.router.navigate([ruta]);
  }

  getValue(objeto:any, field: string){
    return this.utilService.obtenerValor(objeto,field)
  }
}
