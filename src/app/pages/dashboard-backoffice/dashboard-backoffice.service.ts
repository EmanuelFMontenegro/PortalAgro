import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface Titulo{
  titulo?: string | null,
  subTitulo?: string | null
}

@Injectable({
  providedIn: 'root'
})

export class DashboardBackOfficeService {

  dataTitulo = new BehaviorSubject<Titulo>({titulo: null, subTitulo: null})

  constructor(){}
}
