import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardBackofficeComponents } from './dashboard-backoffice.component';
import { DashboardBackofficeRoutingModule } from './dashboard-backoffice-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { ProductoresComponent } from './productores/productores.component';
import { ChacrasComponent } from './chacras/chacras.component';
import { LotesComponent } from './lotes/lotes.component';
import { CalendariosComponent } from './calendarios/calendarios.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { PlanificacionesComponent } from './planificaciones/planificaciones.component';
import { InformesComponent } from './informes/informes.component';
import { CargarChacrasComponent } from './chacras/cargar-chacras/cargar-chacras.component';
import { ChacrasGeolocalizarComponent } from './chacras/chacras-geolocalizar/chacras-geolocalizar.component';
import { DetalleChacraComponent } from './chacras/detalle-chacra/detalle-chacra.component';
import { ChacrasLoteComponent } from './chacras/chacras-lote/chacras-lote.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { PerfilProductorComponent } from './productores/perfil-productor/perfil-productor.component';
import { NuevoUsuarioComponent } from './productores/nuevo-usuario/nuevo-usuario.component';
import { IMPORTS_MATERIAL } from 'src/app/shared/shared.module';
import { ChacrasPerfilComponent } from './chacras-perfil/chacras-perfil.component';
import { BrowserModule } from '@angular/platform-browser';
import { CargarLotesComponent } from './chacras/cargar-lotes/cargar-lotes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosFiltroComponent } from './usuarios/usuarios-filtro/usuarios-filtro.component';
import { RenderProvincesPipe } from 'src/app/services/render-pipes.pipe';
import { RenderDepartmentsPipe } from 'src/app/services/render-pipes.pipe';
import { UsuariosActualizarComponent } from './usuarios/usuarios-actualizar/usuarios-actualizar.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { NgChartsModule } from 'ng2-charts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    DashboardBackofficeComponents,
    InicioComponent,
    ProductoresComponent,
    ChacrasComponent,
    LotesComponent,
    CalendariosComponent,
    CalendariosComponent,
    NotificacionComponent,
    PlanificacionesComponent,
    InformesComponent,
    DialogComponent,
    PerfilProductorComponent,
    NuevoUsuarioComponent,
    ChacrasPerfilComponent,
    CargarChacrasComponent,
    ChacrasGeolocalizarComponent,
    DetalleChacraComponent,
    ChacrasLoteComponent,
    CargarLotesComponent,
    UsuariosComponent,
    UsuariosFiltroComponent,
    RenderProvincesPipe,
    RenderDepartmentsPipe,
    UsuariosActualizarComponent
  ],
  imports: [
    IMPORTS_MATERIAL,
    CommonModule,
    DashboardBackofficeRoutingModule,
    SharedModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    BrowserModule,
    MatRadioModule,
    NgChartsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatGridListModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTableModule,
    MatExpansionModule,
  ],
  providers: [RenderProvincesPipe, RenderDepartmentsPipe],
})
export class DashboardBackofficeModule {}
