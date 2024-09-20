import { Component, EventEmitter,Input, Output } from '@angular/core';
import { TipoLabel } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { TiposDisplaySolicitud } from '../tab-solicitud.component';

@Component({
  selector: 'app-ver-lotes',
  templateUrl: './ver-lotes.component.html',
  styleUrls: ['./ver-lotes.component.scss'],
})
export class VerLotesComponent {

  @Output() btnVolver = new EventEmitter<any>();


  @Input() listadoLotes: any;
  dataView = [
    {label: 'Nombre', field: 'name', tipoLabel: TipoLabel.span},
    {label: 'Hectáreas', field:'dimensions', tipoLabel: TipoLabel.span },
  ]

  constructor(){}

  volver(){
    this.btnVolver.emit(TiposDisplaySolicitud.solicitud)
  }

}
