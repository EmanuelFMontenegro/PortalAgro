import { Component } from '@angular/core';
import {  ConfiguracionService } from 'src/app/services/configuracion.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.sass']
})

export class ConfiguracionComponent {


  constructor( private configuracionService: ConfiguracionService){}


  ngOnInit(): void {
   this.getDrones()
  }

  getDrones(){
    this.configuracionService.getDrones().subscribe(
      data => console.log(data)
    )
  }

}
