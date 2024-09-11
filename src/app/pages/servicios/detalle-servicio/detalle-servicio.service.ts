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
    this.tecnico.next(null);
    this.piloto.next(null);
  }

  getServicio(){
    let servicio =  localStorage.getItem('servicio');
    if(servicio){
      this.servicio = JSON.parse(servicio);
      this.setPiloto(this.servicio?.jobOperator)
      this.setTecnico(this.servicio?.jobTechnical)
    }
  }

  actualizarDatosServicio(){
    let idServicio = this.servicio.id
    this.serviciosService.getServicio(idServicio).subscribe(
      data =>{
        this.servicio = data;
      },
      error =>{

      }
    )
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


}
