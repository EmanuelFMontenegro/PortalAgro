import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrateComponent } from './registro/registro.component';
import { RecuperContrasenaComponent } from './recuper-contrasena/recuper-contrasena.component';
import { NuevaContrasenaComponent } from './nueva-contrasena/nueva-contrasena.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { PrimerRegistroComponent } from './primerRegistro/primerRegistro.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { RecuperContrasenaAdminComponent } from './recuper-contrasena-admin/recuper-contrasena-admincomponent';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'bienvenida', component: BienvenidaComponent },
  { path: 'primerRegistro', component: PrimerRegistroComponent },
  { path: 'login-admin', component: LoginAdminComponent },
  { path: 'registro', component: RegistrateComponent },
  { path: 'recuper-contrasena', component: RecuperContrasenaComponent },
  {
    path: 'recuper-contrasena-admin',
    component: RecuperContrasenaAdminComponent,
  },
  { path: 'nueva-contrasena/:token', component: NuevaContrasenaComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '', redirectTo: '/login-backoffice', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
