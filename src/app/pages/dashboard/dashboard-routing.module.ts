import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { CamposComponent } from './campos/campos.component';

const routes: Routes = [
{ path: 'inicio', component: InicioComponent },
{ path: 'servicios', component: ServiciosComponent },
{ path: 'campos', component: CamposComponent },
{ path: '', redirectTo: '/login', pathMatch: 'full' },
{ path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule) }
,];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
