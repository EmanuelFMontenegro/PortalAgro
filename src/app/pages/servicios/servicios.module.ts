import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiciosRoutingModule } from './servicios-routing.module';
import { ServiciosComponent } from './servicios.component';
import { AddEditServicioComponent } from './add-edit-servicio/add-edit-servicio.component';
import { DetalleServicioComponent } from './detalle-servicio/detalle-servicio.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ServiciosComponent,
    AddEditServicioComponent,
    DetalleServicioComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ServiciosRoutingModule
  ]
})
export class ServiciosModule { }
