import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { ConfiguracionRoutingModule } from "./configuracion-routing.module";
import { ConfiguracionComponent } from "./configuracion.component";
import { ConfiguracionAddEditComponent } from './configuracion-add-edit/configuracion-add-edit.component';

@NgModule({
  declarations: [
    ConfiguracionComponent,
    ConfiguracionAddEditComponent,
  ],
  imports: [
    ConfiguracionRoutingModule,
    SharedModule
  ]
})
export class ConfiguracionModule {}
