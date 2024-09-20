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
import { AsignarPilotoComponent } from './detalle-servicio/tab-solicitud/asignar-piloto/asignar-piloto.component';
import { AsignarTecnicoComponent } from './detalle-servicio/tab-solicitud/asignar-tecnico/asignar-tecnico.component';
import { ListaInsumosComponent } from './detalle-servicio/tab-datos-tecnicos/lista-insumos/lista-insumos.component';
import { ListaImagenesComponent } from './detalle-servicio/tab-datos-tecnicos/lista-imagenes/lista-imagenes.component';
import { EditarDatosComponent } from './detalle-servicio/tab-datos-tecnicos/editar-datos/editar-datos.component';
import { VerLotesComponent } from './detalle-servicio/tab-solicitud/ver-lotes/ver-lotes.component';
import { EditarDatosAppComponent } from './detalle-servicio/tab-datos-app/editar-datos-app/editar-datos-app.component';
import { ListaImagenesAppComponent } from './detalle-servicio/tab-datos-app/lista-imagenes-app/lista-imagenes-app.component';
import { ListaInsumosAppComponent } from './detalle-servicio/tab-datos-app/lista-insumos-app/lista-insumos-app.component';
import { TareasDelDroneComponent } from './detalle-servicio/tab-datos-app/tareas-del-drone/tareas-del-drone.component';
import { DialogEditarInsumoComponent } from './detalle-servicio/tab-datos-app/lista-insumos-app/dialog-editar-insumo/dialog-editar-insumo.component';


@NgModule({
  declarations: [
    ServiciosComponent,
    AddEditServicioComponent,
    DetalleServicioComponent,
    TabSolicitudComponent,
    TabDatosTecnicosComponent,
    TabDatosAppComponent,
    TabInformesComponent,
    TabEventosComponent,
    AsignarPilotoComponent,
    AsignarTecnicoComponent,
    ListaInsumosComponent,
    ListaImagenesComponent,
    EditarDatosComponent,
    VerLotesComponent,
    EditarDatosAppComponent,
    ListaImagenesAppComponent,
    ListaInsumosAppComponent,
    TareasDelDroneComponent,
    DialogEditarInsumoComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ServiciosRoutingModule
  ]
})
export class ServiciosModule { }
