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
  puedeVerDatosTecnicos: any;
  puedeVerDatosPiloto: any;
  puedeVerInformes: any;
  indiceTab = 0;
  backOffice = false;
  estadoOK = true;

  ngOnInit(): void {
    this.servicioInterno.comprobarUrlBackOffice()
    this.backOffice =  this.servicioInterno.backOffice?.value
    this.urlBase = this.backOffice ? 'dashboard-backoffice' : 'dashboard'
    this.recuperarDatos()
    this.detectarCambiosEstado();
  }

  /** Si llega a cambiar los datos, se vuelve a obtener los datos para el servicio, para asegurar la integridad de los datos
   *  y el correcto funcionamiento de lso TABS segun estad */
  detectarCambiosEstado(){
    this.subscription.add(
      this.detalleServicioService.estado$?.subscribe(
        (data:any) =>{
           if(data){
            this.recuperarDatos();
           }
        }
      )
    )
  }

  recuperarDatos(){
    this.getDatosServicio();
    this.getUser()
  }

  async getUser(){
    this.detalleServicioService.getUserConPermisos()
  }

  async getDatosServicio(){
   this.estadoOK = false;
   await this.detalleServicioService.getServicio()
   this.servicio = this.detalleServicioService.servicio;
   this.detalleServicioService.getEstados()
   this.subscribirPiloto();
   this.subscribirTecnico();

   this.puedeVerDatosTecnicos = await this.detalleServicioService.getDatosTecnico()
   this.puedeVerDatosPiloto = await this.detalleServicioService.getDatosApp()
   this.puedeVerInformes = await this.detalleServicioService.getInformes()

   console.log(this.puedeVerDatosPiloto, this.puedeVerDatosTecnicos, this.puedeVerInformes)

   this.estadoOK = true;
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
