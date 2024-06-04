import { NgModule } from "@angular/core"
import { MiniaturaListadoComponent } from "./components/miniatura-listado/miniatura-listado.component";
import { CabeceraComponent } from './components/cabecera/cabecera.component';
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
  declarations:[
    MiniaturaListadoComponent,
    CabeceraComponent
  ],
  imports:[
    CommonModule,
    BrowserModule],
  exports: [
    MiniaturaListadoComponent
  ]
})

export class SharedModule { }
