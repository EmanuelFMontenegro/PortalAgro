import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/AuthService';
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
    public authService: AuthService,
    private router: Router){}

  subscription = new Subscription()
  urlBase = '';
  backOffice = false;
  servicio: any
  tecnicoAsignado:any;
  pilotoAsignado:any;
  indiceTab = 0;

  ngOnInit(): void {
    this.urlBase =  this.backOffice ? 'dashboard-backoffice' : 'dashboard'
    this.detalleServicioService.getEstados()
    this.getDatosServicio();
    this.getUser()
  }

  async getUser(){
    this.detalleServicioService.getUserConPermisos()
  }

  async getDatosServicio(){
   await this.detalleServicioService.getServicio()
   this.servicio = this.detalleServicioService.servicio;
   this.subscribirPiloto();
   this.subscribirTecnico();
  }

  subscribirTecnico(){
   this.subscription.add(
    this.detalleServicioService.tecnico$.subscribe(
      (valor: any) => {
        this.tecnicoAsignado = valor
      }
    ))
  }

  subscribirPiloto(){
    this.subscription.add(
      this.detalleServicioService.piloto$.subscribe(
        (valor: any) => {
          this.pilotoAsignado = valor
        }
      ))
  }

  onTabChange(indice: any){
    this.indiceTab = indice.index;
  }

  volver() {
    this.router.navigate([this.urlBase + '/servicios']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    this.detalleServicioService.cleanVariable();
  }
}
