import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiciosComponent } from './servicios.component';
import { DetalleServicioComponent } from './detalle-servicio/detalle-servicio.component';
import { AddEditServicioComponent } from './add-edit-servicio/add-edit-servicio.component';
import { InsumosComponent } from './insumos/insumos.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ServiciosComponent,
      },
      {
        path: 'nuevo',
        component: AddEditServicioComponent,
      },
      {
        path: ':id/editar',
        component: AddEditServicioComponent,
      },
      {
        path: ':id',
        component: DetalleServicioComponent,
      },
      {
        path: ':id/insumo/:idInsumo',
        component: InsumosComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiciosRoutingModule { }
