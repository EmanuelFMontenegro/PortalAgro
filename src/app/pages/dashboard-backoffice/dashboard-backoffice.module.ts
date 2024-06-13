import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardBackofficeComponents } from './dashboard-backoffice.component';
import { DashboardBackofficeRoutingModule } from './dashboard-backoffice-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { ProductoresComponent } from './productores/productores.component';
import { ChacrasComponent } from './chacras/chacras.component';
import { LotesComponent } from './lotes/lotes.component';
import { CalendariosComponent } from './calendarios/calendarios.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { PlanificacionesComponent } from './planificaciones/planificaciones.component';
import { InformesComponent } from './informes/informes.component';

import { DialogComponent } from './dialog/dialog.component';
import { PerfilProductorComponent } from './productores/perfil-productor/perfil-productor.component';
import { NuevoUsuarioComponent } from './productores/nuevo-usuario/nuevo-usuario.component';
import { IMPORTS_MATERIAL, SharedModule } from 'src/app/shared/shared.module';
import { ChacrasPerfilComponent } from './chacras-perfil/chacras-perfil.component';

@NgModule({
  declarations: [
    DashboardBackofficeComponents,
    InicioComponent,
    ServiciosComponent,
    ProductoresComponent,
    ChacrasComponent,
    LotesComponent,
    CalendariosComponent,
    NotificacionComponent,
    PlanificacionesComponent,
    InformesComponent,
    DialogComponent,
    PerfilProductorComponent,
    NuevoUsuarioComponent,
    ChacrasPerfilComponent,
  ],
  imports: [
    IMPORTS_MATERIAL,
    CommonModule,
    DashboardBackofficeRoutingModule,
    SharedModule
  ],
})
export class DashboardBackofficeModule {}
