import { NgModule } from "@angular/core"
import { MiniaturaListadoComponent } from "./components/miniatura-listado/miniatura-listado.component";
import { CabeceraComponent } from './components/cabecera/cabecera.component';
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";

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
  MatCheckboxModule,
  MatDialogModule,
]

export const IMPORT_CORE = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
]

@NgModule({
  declarations:[
    MiniaturaListadoComponent,
    CabeceraComponent
  ],
  imports:[
    IMPORT_CORE,
    IMPORTS_MATERIAL
  ],
  exports: [
    IMPORT_CORE,
    IMPORTS_MATERIAL,
    MiniaturaListadoComponent
  ]
})

export class SharedModule { }
