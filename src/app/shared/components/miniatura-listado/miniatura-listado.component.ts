import { Component, Input } from '@angular/core';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-miniatura-listado',
  templateUrl: './miniatura-listado.component.html',
  styleUrls: ['./miniatura-listado.component.sass']
})
export class MiniaturaListadoComponent {

  constructor(private utilService: UtilsService){}

  // ENTRADA
  @Input() objeto: any
  @Input() dataView: any

  verMas(data: any){
    console.log(data, this.dataView)

  }

  getValue(objeto:any, field: string){
    console.log(objeto, field)
     return objeto[field]
    //  return this.utilService.obtenerValor(objeto,field)
  }
}
