// Componentes de Pages

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { InicioComponent } from './inicio/inicio.component';
import { CampoComponent } from './campo/campo.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { GeolocalizacionComponent } from './geolocalizacion/geolocalizacion.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ProductosComponent } from './productos/productos.component';


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
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { FormatDatePipe } from 'src/app/format-date.pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetalleCampoComponent } from './detalle-campo/detalle-campo.component';
import { LoteComponent } from './lote/lote.component';


const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    DashboardComponent,
    InicioComponent,
    ServiciosComponent,
    GeolocalizacionComponent,
    ConfiguracionComponent,
    PerfilComponent,
    ReportesComponent,
    ProductosComponent,
    CampoComponent,
    FormatDatePipe,
    DetalleCampoComponent,
    LoteComponent

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
    MatTableDataSource,
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
    MatDialogModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatOptionModule,
    BrowserAnimationsModule,
    RouterModule
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
})
export class DashboardModule { }
