import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardBackofficeComponents } from './dashboard-backoffice.component';
import { DashboardBackofficeRoutingModule } from './dashboard-backoffice-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { ProductoresComponent } from './productores/productores.component';
import { ChacrasComponent } from './chacras/chacras.component';
import { LotesComponent } from './lotes/lotes.component';
import { CalendariosComponent } from './calendarios/calendarios.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { PlanificacionesComponent } from './planificaciones/planificaciones.component';
import { InformesComponent } from './informes/informes.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';import { ChacrasPerfilComponent } from './chacras-perfil/chacras-perfil.component';
import { CargarChacrasComponent } from './chacras/cargar-chacras/cargar-chacras.component';
import { ChacrasGeolocalizarComponent } from './chacras/chacras-geolocalizar/chacras-geolocalizar.component';
import { DetalleChacraComponent } from './chacras/detalle-chacra/detalle-chacra.component';
import { ChacrasLoteComponent } from './chacras/chacras-lote/chacras-lote.component';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
import { MatOptionModule } from '@angular/material/core'; // Corrección aquí
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from './dialog/dialog.component';
import { PerfilProductorComponent } from './productores/perfil-productor/perfil-productor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NuevoUsuarioComponent } from './productores/nuevo-usuario/nuevo-usuario.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { CargarLotesComponent } from './chacras/cargar-lotes/cargar-lotes.component';


@NgModule({
  declarations: [
    DashboardBackofficeComponents,
    InicioComponent,
    ServiciosComponent,
    ProductoresComponent,
    ChacrasComponent,
    LotesComponent,
    CalendariosComponent,
    NotificacionComponent,
    PlanificacionesComponent,
    InformesComponent,
    ConfiguracionComponent,
    DialogComponent,
    PerfilProductorComponent,
    NuevoUsuarioComponent,
    ChacrasPerfilComponent,
    CargarChacrasComponent,
    ChacrasGeolocalizarComponent,
    DetalleChacraComponent,
    ChacrasLoteComponent,
    CargarLotesComponent,
  ],
  imports: [
    CommonModule,
    DashboardBackofficeRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule
  ],
})
export class DashboardBackofficeModule {}
