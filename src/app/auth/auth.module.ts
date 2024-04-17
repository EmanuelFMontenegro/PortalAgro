import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import { RegistrateComponent } from './registro/registro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RecuperContrasenaComponent } from './recuper-contrasena/recuper-contrasena.component';
import { MatIconModule } from '@angular/material/icon';
import { NuevaContrasenaComponent } from './nueva-contrasena/nueva-contrasena.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { PrimerRegistroComponent } from './primerRegistro/primerRegistro.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { RecuperContrasenaAdminComponent } from './recuper-contrasena-admin/recuper-contrasena-admin.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NuevaContrasenaAdminComponent } from './nueva-contrasena-admin/nueva-contrasena-admin.component';
@NgModule({
  declarations: [
    LoginComponent,
    RegistrateComponent,
    RecuperContrasenaComponent,
    NuevaContrasenaComponent,
    BienvenidaComponent,
    PrimerRegistroComponent,
    LoginAdminComponent,
    RecuperContrasenaAdminComponent,
    NuevaContrasenaAdminComponent,
  ],
  imports: [
    AuthRoutingModule,
    RouterModule,
    CommonModule,
    MatCardModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    NgxSpinnerModule.forRoot (),
    MatProgressSpinnerModule,
    ToastrModule.forRoot(),
  ],
})
export class AuthModule {}
