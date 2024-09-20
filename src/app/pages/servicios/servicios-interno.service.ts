import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ServicioInterno{

  backOffice = new BehaviorSubject<boolean>(false);
  backOffice$: any;

  constructor(private router: Router){
    this.backOffice$ = this.backOffice.asObservable();
  }

  comprobarUrlBackOffice(){
    let isBackOffice = this.router.url?.includes('dashboard-backoffice');
    this.backOffice.next(isBackOffice)
  }

}
