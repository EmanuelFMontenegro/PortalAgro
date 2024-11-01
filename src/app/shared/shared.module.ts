import { NgModule } from '@angular/core';
import { MiniaturaListadoComponent } from './components/miniatura-listado/miniatura-listado.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
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
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { HeaderInnerComponent } from './components/header-inner/header-inner.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CardComponent } from './components/card/card.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CalendarPopupComponent } from './components/calendar-popup/calendar-popup.component';
import { FooterComponent } from './components/footer/footer.component';
import { TableComponent } from './components/table/table.component';
import { WidgetComponent } from './components/widget/widget.component';
import { CardContadorComponent } from './components/card-contador/card-contador.component';
import { MatTableModule } from '@angular/material/table';
import { NgxPaginationModule } from 'ngx-pagination';

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
  MatChipsModule,
  MatTableModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatTabsModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  MatTableModule,
  NgxPaginationModule,
  MatPaginatorModule
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
    ToolbarComponent,
    FooterComponent,
    HeaderInnerComponent,
    SearchbarComponent,
    WidgetComponent,
    TableComponent,
    CardContadorComponent
  ],
  imports: [IMPORT_CORE, IMPORTS_MATERIAL, CALENDAR, CardComponent],
  exports: [
    IMPORT_CORE,
    IMPORTS_MATERIAL,
    MiniaturaListadoComponent,
    HeaderUserComponent,
    FormularioComponent,
    TituloContainerComponent,
    FiltrosContainerComponent,
    CalendarComponent,
    CalendarPopupComponent,
    ToolbarComponent,
    FooterComponent,
    HeaderInnerComponent,
    CardComponent,
    SearchbarComponent,
    WidgetComponent,
    TableComponent,
    CardContadorComponent
  ],
})
export class SharedModule {}
