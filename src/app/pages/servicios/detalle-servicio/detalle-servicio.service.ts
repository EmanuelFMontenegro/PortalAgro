import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
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

  datosTecnico:any;
  datosPiloto:any;
  servicio:any;
  servicioId: any;
  estados:any;
  prioridades: any;

  constructor(
    private estadoService:EstadosService,
    private serviciosService:ServiciosService){
      this.tecnico$ = this.tecnico.asObservable();
      this.piloto$ = this.piloto.asObservable();
    }

  cleanVariable(){
    this.servicio = null;
    this.servicioId = null;
    this.tecnico.next(null);
    this.piloto.next(null);
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
      this.estadoService.getAll_backOffice().subscribe(
        data=> {
          this.estados = data.list[0]
        },
        error =>{

        }
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
