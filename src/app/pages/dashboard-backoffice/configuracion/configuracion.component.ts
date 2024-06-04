import { Component } from '@angular/core';
import {  ConfiguracionService } from 'src/app/services/configuracion.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.sass']
})

export class ConfiguracionComponent {


  constructor( private configuracionService: ConfiguracionService,
              ){}

  listado: any [] = []
  dataView: any [] = [
     {label: 'Nombre', field: 'nickname' },
     {label: 'Función', field:'function' },
     {label: 'Marca', field:'brand' },
     {label: 'Modelo', field: 'model'},
  ]
  opcionSeleccionada = 'Drones'


  ngOnInit(): void {
   this.getDrones()
  }

  getDrones(){
    this.configuracionService.getDrones().subscribe(
      data =>{
        if(data.list.length){
          this.listado = data.list[0]
          console.log(this.listado)
        }

      }
    )
  }

  cambiarConfig(data:any){
     console.log(data)
  }

  nuevo(){

  }

}
