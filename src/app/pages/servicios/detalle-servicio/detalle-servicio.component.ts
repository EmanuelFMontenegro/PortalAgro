import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DetalleServicioService } from './detalle-servicio.service';

@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetalleServicioComponent {

  constructor(
    private detalleServicioService: DetalleServicioService,
    private router: Router){}

  urlBase = '';
  backOffice = false;

  ngOnInit(): void {
    this.urlBase =  this.backOffice ? 'dashboard-backoffice' : 'dashboard'
  }

  volver() {
    this.router.navigate([this.urlBase + '/servicios']);
  }
}
