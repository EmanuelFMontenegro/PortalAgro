import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiciosRoutingModule } from './servicios-routing.module';
import { ServiciosComponent } from './servicios.component';
import { AddEditServicioComponent } from './add-edit-servicio/add-edit-servicio.component';
import { DetalleServicioComponent } from './detalle-servicio/detalle-servicio.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabSolicitudComponent } from './detalle-servicio/tab-solicitud/tab-solicitud.component';
import { TabDatosTecnicosComponent } from './detalle-servicio/tab-datos-tecnicos/tab-datos-tecnicos.component';
import { TabDatosAppComponent } from './detalle-servicio/tab-datos-app/tab-datos-app.component';
import { TabInformesComponent } from './detalle-servicio/tab-informes/tab-informes.component';
import { TabEventosComponent } from './detalle-servicio/tab-eventos/tab-eventos.component';


@NgModule({
  declarations: [
    ServiciosComponent,
    AddEditServicioComponent,
    DetalleServicioComponent,
    TabSolicitudComponent,
    TabDatosTecnicosComponent,
    TabDatosAppComponent,
    TabInformesComponent,
    TabEventosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ServiciosRoutingModule
  ]
})
export class ServiciosModule { }
