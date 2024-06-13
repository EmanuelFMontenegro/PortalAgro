import { Component } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.sass']
})
export class InformesComponent {

  constructor(public dashboardBackOffice: DashboardBackOfficeService)
    {
     this.dashboardBackOffice.dataTitulo.next({ titulo: `Informes` , subTitulo: ''})
    }

}
