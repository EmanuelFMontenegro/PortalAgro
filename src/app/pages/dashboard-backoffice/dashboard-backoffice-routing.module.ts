import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { DashboardBackofficeComponents } from './dashboard-backoffice.component';
import { InicioComponent } from './inicio/inicio.component';
import { ProductoresComponent } from './productores/productores.component';
import { ChacrasComponent } from './chacras/chacras.component';
import { LotesComponent } from './lotes/lotes.component';
import { CalendariosComponent } from './calendarios/calendarios.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { PlanificacionesComponent } from './planificaciones/planificaciones.component';
import { InformesComponent } from './informes/informes.component';
import { PerfilProductorComponent } from './productores/perfil-productor/perfil-productor.component';
import { NuevoUsuarioComponent } from './productores/nuevo-usuario/nuevo-usuario.component';
import { ChacrasPerfilComponent } from './chacras-perfil/chacras-perfil.component';
import { CargarChacrasComponent } from './chacras/cargar-chacras/cargar-chacras.component';
import { ChacrasGeolocalizarComponent } from './chacras/chacras-geolocalizar/chacras-geolocalizar.component';
import { DetalleChacraComponent } from './chacras/detalle-chacra/detalle-chacra.component';
import { ChacrasLoteComponent } from './chacras/chacras-lote/chacras-lote.component';
import { CargarLotesComponent } from './chacras/cargar-lotes/cargar-lotes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosFiltroComponent } from './usuarios/usuarios-filtro/usuarios-filtro.component';
import { UsuariosActualizarComponent } from './usuarios/usuarios-actualizar/usuarios-actualizar.component';

const routes: Routes = [
  {
    path: 'dashboard-backoffice',
    component: DashboardBackofficeComponents,
    canActivate: [AuthGuard], // Aplicar el guardia a toda la sección del dashboard
    children: [
      { path: 'inicio', component: InicioComponent },
      {
        path: 'servicios',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../servicios/servicios.module').then(
            (x) => x.ServiciosModule
          ),
      },
      { path: 'productores', component: ProductoresComponent },
      {
        path: 'usuarios-filtro',
        component: UsuariosFiltroComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_ADMIN'] },
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_ADMIN'] },
      },
      {
        path: 'usuarios-actualizar/:id',
        component: UsuariosActualizarComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_ADMIN'] },
      },
      { path: 'perfil-productor/:id', component: PerfilProductorComponent },
      { path: 'nuevo-usuario', component: NuevoUsuarioComponent },
      { path: 'chacras', component: ChacrasComponent },
      { path: 'chacras-perfil', component: ChacrasPerfilComponent },
      { path: 'detalle-chacra', component: DetalleChacraComponent },
      { path: 'chacras-geolocalizar', component: ChacrasGeolocalizarComponent },
      { path: 'cargar-chacras', component: CargarChacrasComponent },
      { path: 'chacras-lote', component: ChacrasLoteComponent },
      { path: 'cargar-lotes', component: CargarLotesComponent },
      { path: 'lotes', component: LotesComponent },
      { path: 'calendarios', component: CalendariosComponent },
      { path: 'notificacion', component: NotificacionComponent },
      { path: 'planificaciones', component: PlanificacionesComponent },
      { path: 'informes', component: InformesComponent },
      {
        path: 'configuracion',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./configuracion/configuracion.module').then(
            (x) => x.ConfiguracionModule
          ),
      },

      { path: '', redirectTo: 'inicio', pathMatch: 'full' },

    ],
  },
  { path: '', redirectTo: '/login-backoffice', pathMatch: 'full' },
  { path: '**', redirectTo: '/login-backoffice' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardBackofficeRoutingModule {}
