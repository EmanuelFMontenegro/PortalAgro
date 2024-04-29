import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { GeolocalizacionComponent } from './geolocalizacion/geolocalizacion.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CampoComponent } from './campo/campo.component';
import { DashboardComponent } from './dashboard.component';
import { BienvenidaComponent } from 'src/app/auth/bienvenida/bienvenida.component';
import { DetalleCampoComponent } from './detalle-campo/detalle-campo.component';
import { LoteComponent } from './lote/lote.component';
import { CargarLoteComponent } from './cargar-lote/cargar-lote.component';
import { InformesComponent } from './informes/informes.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { ChacrasComponent } from './chacras/chacras.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],

    children: [
      { path: 'bienvenida', component: BienvenidaComponent},
      { path: 'geolocalizacion', component: GeolocalizacionComponent},
      { path: 'inicio', component:InicioComponent},
      { path: 'detalle-campo', component: DetalleCampoComponent},
      { path: 'lote', component: LoteComponent},
      { path :'cargar-lote', component: CargarLoteComponent},
      { path: 'servicios', component: ServiciosComponent},
      { path: 'campo', component: CampoComponent},
      { path: 'configuracion', component: ConfiguracionComponent},
      { path: 'perfil', component: PerfilComponent},
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'servicios', component: ServiciosComponent },
      { path: 'informes', component: InformesComponent },
      { path: 'calendario', component: CalendarioComponent },
      { path: 'chacras', component: ChacrasComponent },
      { path: 'notificaciones', component: NotificacionesComponent },
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
