import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { InicioComponent } from './inicio/inicio.component';
import { DashboardBackofficeComponents } from './dashboard-backoffice.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { ProductoresComponent } from './productores/productores.component';
import { ChacrasComponent } from './chacras/chacras.component';
import { LotesComponent } from './lotes/lotes.component';
import { CalendariosComponent } from './calendarios/calendarios.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { PlanificacionesComponent } from './planificaciones/planificaciones.component';
import { InformesComponent } from './informes/informes.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { PerfilProductorComponent } from './productores/perfil-productor/perfil-productor.component';
import { NuevoUsuarioComponent } from './productores/nuevo-usuario/nuevo-usuario.component';
import { ChacrasPerfilComponent } from './chacras-perfil/chacras-perfil.component';
const routes: Routes = [
  {
    path: 'dashboard-backoffice',
    component: DashboardBackofficeComponents,
    canActivate: [AuthGuard],
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'servicios', component: ServiciosComponent },
      { path: 'productores', component: ProductoresComponent },
      { path: 'perfil-productor', component: PerfilProductorComponent },
      { path: 'nuevo-usuario', component: NuevoUsuarioComponent },
      { path: 'chacras', component: ChacrasComponent },
      { path: 'chacras-perfil', component: ChacrasPerfilComponent },
      { path: 'lotes', component: LotesComponent },
      { path: 'calendarios', component: CalendariosComponent },
      { path: 'notificacion', component: NotificacionComponent },
      { path: 'planificaciones', component: PlanificacionesComponent },
      { path: 'informes', component: InformesComponent },
      {
        path: 'configuracion',
        canActivate: [AuthGuard],
        loadChildren: () => import('./configuracion/configuracion.module').then(x => x.ConfiguracionModule)
      },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/login-backoffice', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardBackofficeRoutingModule {}
