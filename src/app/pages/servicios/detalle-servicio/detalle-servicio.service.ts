import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class DetalleServicioService {

  constructor(){}

  servicio:any

  getServicio(){
    let servicio =  localStorage.getItem('servicio');
    if(servicio) this.servicio = JSON.parse(servicio);
    console.log(this.servicio)
  }



}
