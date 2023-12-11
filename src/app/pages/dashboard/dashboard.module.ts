import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { InicioComponent } from './inicio/inicio.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { CamposComponent } from './campos/campos.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ReportesComponent } from './reportes/reportes.component';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrModule } from 'ngx-toastr';
import { ProductosComponent } from './productos/productos.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { HomeComponent } from './home/home.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';





@NgModule({
  declarations: [
    DashboardComponent,
    InicioComponent,
    ServiciosComponent,
    CamposComponent,
    ConfiguracionComponent,
    PerfilComponent,
    ReportesComponent,
    ProductosComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    ToastrModule.forRoot(),
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class DashboardModule { }
