import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InicioComponent } from './pages/dashboard/inicio/inicio.component';
import { ServiciosComponent } from './pages/dashboard/servicios/servicios.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'inicio', component: InicioComponent},
      { path: 'servicios', component: ServiciosComponent},
    ]
  },
  { path: '', redirectTo: '/dashboard/inicio', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
