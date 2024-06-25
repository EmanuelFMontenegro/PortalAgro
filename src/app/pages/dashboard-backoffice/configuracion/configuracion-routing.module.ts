import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddEditDronesComponent } from "./add-edit-drones/add-edit-drones.component";
import { AddEditInsumosComponent } from "./add-edit-insumos/add-edit-insumos.component";
import { ConfiguracionComponent } from "./configuracion.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ConfiguracionComponent,
      },
      {
        path: 'dron',
        component: AddEditDronesComponent,
      },
      {
        path: 'dron/:id',
        component: AddEditDronesComponent,
      },
      {
        path: 'insumo',
        component: AddEditInsumosComponent,
      },
      {
        path: 'insumo/:id',
        component: AddEditInsumosComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
