import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardBackofficeComponents } from './pages/dashboard-backoffice/dashboard-backoffice.component';


const routes: Routes = [
{ path: 'login', component: LoginComponent },
{
  path: 'dashboard', component: DashboardComponent
},
{
  path: 'dashboard-backoffice', component: DashboardBackofficeComponents
},
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
