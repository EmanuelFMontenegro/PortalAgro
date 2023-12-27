import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { ProductosComponent } from './productos/productos.component';
import { GeolocalizacionComponent } from './geolocalizacion/geolocalizacion.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { PerfilComponent } from './perfil/perfil.component';
import { DashboardComponent } from './dashboard.component';
import { BienvenidaComponent } from 'src/app/auth/bienvenida/bienvenida.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'bienvenida', component: BienvenidaComponent},
      { path: 'geolocalizacion', component: GeolocalizacionComponent},
      { path: 'inicio', component: InicioComponent},
      { path: 'servicios', component: ServiciosComponent},
      { path: 'productos', component: ProductosComponent},
      { path: 'configuracion', component: ConfiguracionComponent},
      { path: 'perfil', component: PerfilComponent},
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
