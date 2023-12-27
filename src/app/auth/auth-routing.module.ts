import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrateComponent } from './registro/registro.component';
import { RecuperContrasenaComponent } from './recuper-contrasena/recuper-contrasena.component';
import { NuevaContrasenaComponent } from './nueva-contrasena/nueva-contrasena.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';


const routes: Routes = [
  { path: 'bienvenida', component: BienvenidaComponent},
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistrateComponent },
  { path: 'recuper-contrasena', component: RecuperContrasenaComponent },
  { path: 'nueva-contrasena/:token', component: NuevaContrasenaComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
