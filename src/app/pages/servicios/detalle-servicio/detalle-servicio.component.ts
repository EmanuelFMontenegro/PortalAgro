import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/AuthService';
import { ServicioInterno } from '../servicios-interno.service';
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
    private servicioInterno: ServicioInterno,
    public authService: AuthService,
    private router: Router){}

  subscription = new Subscription()
  urlBase = '';
  servicio: any
  tecnicoAsignado:any;
  pilotoAsignado:any;
  indiceTab = 0;

  ngOnInit(): void {
    this.urlBase =  this.servicioInterno.backOffice.value ? 'dashboard-backoffice' : 'dashboard'
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
    console.log(this.urlBase+ "LA NASE ESSSSSSSSSS")
    this.router.navigate([this.urlBase + '/servicios']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    this.detalleServicioService.cleanVariable();
  }
}
