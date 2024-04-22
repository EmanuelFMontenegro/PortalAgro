import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrateComponent } from './registro/registro.component';
import { RecuperContrasenaComponent } from './recuper-contrasena/recuper-contrasena.component';
import { NuevaContrasenaComponent } from './nueva-contrasena/nueva-contrasena.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { PrimerRegistroComponent } from './primerRegistro/primerRegistro.component';
import { LoginBackofficeComponent } from './login-backoffice/login-backoffice.component';
import { NuevaContrasenaBackofficeComponent } from './nueva-contrasena-backoffice/nueva-contrasena-backoffice.component';
import { RecuperContrasenaBackofficeComponent } from './recuper-contrasena-backoffice/recuper-contrasena-backoffice.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'bienvenida', component: BienvenidaComponent },
  { path: 'primerRegistro', component: PrimerRegistroComponent },
  { path: 'login-backoffice', component: LoginBackofficeComponent },
  { path: 'registro', component: RegistrateComponent },
  { path: 'recuper-contrasena', component: RecuperContrasenaComponent },
  {
    path: 'recuper-contrasena-backoffice',
    component: RecuperContrasenaBackofficeComponent,
  },
  {
    path: 'nueva-contrasena-backoffice/:token',
    component: NuevaContrasenaBackofficeComponent,
  },
  { path: 'nueva-contrasena/:token', component: NuevaContrasenaComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
