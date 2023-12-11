import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InicioComponent } from './pages/dashboard/inicio/inicio.component';
import { ServiciosComponent } from './pages/dashboard/servicios/servicios.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'servicios', component: ServiciosComponent },

    ]
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
