import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './pages/login/login.component';
import { RegistrateComponent } from './pages/registro/registro.component';
import { RecuperContrasenaComponent } from './pages/recuper-contrasena/recuper-contrasena.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistrateComponent },
  { path: 'recuper-contrasena', component: RecuperContrasenaComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Ruta predeterminada
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrateComponent,
    RecuperContrasenaComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes), // Definición de rutas
    BrowserAnimationsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    ToastrModule.forRoot(),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
