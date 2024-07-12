import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { ConfiguracionRoutingModule } from "./configuracion-routing.module";
import { ConfiguracionComponent } from "./configuracion.component";
import { AddEditDronesComponent } from './add-edit-drones/add-edit-drones.component';
import { AddEditInsumosComponent } from './add-edit-insumos/add-edit-insumos.component';

@NgModule({
  declarations: [
    ConfiguracionComponent,
    AddEditDronesComponent,
    AddEditInsumosComponent,
  ],
  imports: [
    ConfiguracionRoutingModule,
    SharedModule
  ]
})
export class ConfiguracionModule {}
