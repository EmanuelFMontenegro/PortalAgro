import { NgModule } from '@angular/core';
import { MiniaturaListadoComponent } from './components/miniatura-listado/miniatura-listado.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { FormularioComponent } from './components/formulario/formulario.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TituloContainerComponent } from './components/titulo-container/titulo-container.component';
import { FiltrosContainerComponent } from './components/filtros-container/filtros-container.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarPopupComponent } from './components/calendar-popup/calendar-popup.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginadorComponent } from './components/paginador/paginador.component';
export const IMPORTS_MATERIAL = [
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
  MatCheckboxModule,
  MatSelectModule,
  MatIconModule,
  MatChipsModule,
  MatCheckboxModule,
  MatDialogModule,
  MatPaginatorModule,
];

export const IMPORT_CORE = [CommonModule, FormsModule, ReactiveFormsModule];
export const CALENDAR = [FullCalendarModule];
@NgModule({
  declarations: [
    MiniaturaListadoComponent,
    HeaderUserComponent,
    FormularioComponent,
    TituloContainerComponent,
    FiltrosContainerComponent,
    CalendarComponent,
    CalendarPopupComponent,
    PaginadorComponent

  ],
  imports: [IMPORT_CORE, IMPORTS_MATERIAL, CALENDAR],
  exports: [
    IMPORT_CORE,
    IMPORTS_MATERIAL,
    MiniaturaListadoComponent,
    HeaderUserComponent,
    FormularioComponent,
    TituloContainerComponent,
    FiltrosContainerComponent,
    CalendarComponent,
    CalendarPopupComponent
  ]
})
export class SharedModule {}
