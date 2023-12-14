import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { ProductosComponent } from './productos/productos.component';
import { CamposComponent } from './campos/campos.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { PerfilComponent } from './perfil/perfil.component';
import { DashboardComponent } from './dashboard.component';
import { BienvenidaComponent } from 'src/app/auth/bienvenida/bienvenida.component';



const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'bienvenida', component:BienvenidaComponent },
      { path: 'inicio', component: InicioComponent },
      { path: 'servicios', component: ServiciosComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'configruacion', component: ConfiguracionComponent },
      { path: 'perfil', component: PerfilComponent },
      // Asegúrate de tener una ruta por defecto para el dashboard
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // otras rutas fuera del dashboard
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
