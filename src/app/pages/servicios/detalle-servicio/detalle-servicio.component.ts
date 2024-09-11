import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
    private router: Router){
      this.detalleServicioService.getServicio();
      this.servicio = this.detalleServicioService.servicio;
    }

  subscription = new Subscription()
  urlBase = '';
  backOffice = false;
  servicio: any
  tecnicoAsignado:any;
  pilotoAsignado:any;

  ngOnInit(): void {
    this.urlBase =  this.backOffice ? 'dashboard-backoffice' : 'dashboard'
    this.detalleServicioService.actualizarDatosServicio();
    this.detalleServicioService.getEstados()

    // TÉCNICO
    this.subscription.add(
      this.detalleServicioService.tecnico$.subscribe(
        (valor: any) => {
          this.tecnicoAsignado = valor
          console.log(this.tecnicoAsignado)
        }
      )
    )

    // PILOTO
    this.subscription.add(
      this.detalleServicioService.piloto$.subscribe(
        (valor: any) => {
          this.pilotoAsignado = valor
          console.log(this.pilotoAsignado)
        }
      )
    )
  }

  volver() {
    this.router.navigate([this.urlBase + '/servicios']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    this.detalleServicioService.cleanVariable();
  }
}
