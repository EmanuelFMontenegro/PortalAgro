import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PermisosUsuario } from "src/app/models/permisos.model";
import { AuthService } from "src/app/services/AuthService";
import { EstadosService } from "src/app/services/estados.services";
import { ServiciosService } from "src/app/services/servicios.service";

@Injectable({
  providedIn: 'root'
})

export class DetalleServicioService {

  piloto = new BehaviorSubject<any>(null);
  piloto$: any;
  tecnico = new BehaviorSubject<any>(null);
  tecnico$: any;
  estado = new BehaviorSubject<any>(null);
  estado$: any;

  datosTecnico:any;
  datosPiloto:any;
  servicio:any;
  servicioId: any;
  estados:any;
  prioridades: any;
  permisos: PermisosUsuario | null = null

  constructor(
    private estadoService:EstadosService,
    private authService: AuthService,
    private serviciosService:ServiciosService){
      this.tecnico$ = this.tecnico.asObservable();
      this.piloto$ = this.piloto.asObservable();
      this.estado$ = this.estado.asObservable();
    }

  cleanVariable(){
    this.servicio = null;
    this.servicioId = null;
    this.tecnico.next(null);
    this.piloto.next(null);
    this.estado.next(null);
    this.estados = null
  }

  async getServicio(){
      await this.getIdLocal();
      await this.actualizarDatosServicio()
      localStorage.setItem('servicio', JSON.stringify(this.servicio) )
      this.setPiloto(this.servicio?.jobOperator)
      this.setTecnico(this.servicio?.jobTechnical)
  }

  getIdLocal(){
    return new Promise<any>((resolve)=>{
      let servicio =  localStorage.getItem('servicio');
      if(servicio){
        let servicioCache = JSON.parse(servicio)
        this.servicioId = servicioCache.id
      }
      resolve(true)
    })
  }

  async getUserConPermisos(){
    await this.authService.getUserWithPermisos()
    this.permisos = this.authService.userWithPermissions?.value?.permisos
  }

  actualizarDatosServicio(){
    return new Promise<any>((resolve)=>{
      this.serviciosService.getServicio(this.servicioId).subscribe(
        data =>{
          this.servicio = data;
          resolve(this.servicio)
        },
        error =>{
            resolve(null)
        }
      )
    })
  }

  getEstados(){
    if(!this.estados){
      this.serviciosService.getStatusByService(this.servicioId).subscribe(
        data=> this.estados = data,
        error =>{}
      )
    }
    return this.estados
  }

  setPiloto(piloto: any){
    if(piloto) this.piloto.next(piloto)
  }

  setTecnico(tecnico: any){
    if(tecnico) this.tecnico.next(tecnico)
  }

  // DATOS TECNICO
  getDatosTecnico(){
    return new Promise<any>((resolve)=>{
      this.serviciosService.getTecnico(this.servicio.id).subscribe(
        data=> {
          this.datosTecnico = data
          resolve(this.datosTecnico)
        },
        error => { resolve(null)}
      )
    })
  }


// DATOS PILOTO
 getDatosApp(){
  return new Promise<any>((resolve)=>{
    this.serviciosService.getApp(this.servicio.id).subscribe(
      data=> {
        this.datosPiloto = data
        resolve(this.datosPiloto)
      },
      error => { resolve(null)}
    )
  })
}

}
