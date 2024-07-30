import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.scss']
})
export class DetalleServicioComponent {

  constructor(
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
