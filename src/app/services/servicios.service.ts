import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
  })

  export class ServiciosService {

    private empresaCotizar = new BehaviorSubject<any>(null);
    getEmprezaCotizar = this.empresaCotizar.asObservable();

    constructor(private http: HttpClient){}

    getServiciosByProductor(): Observable<any>{
      let url =  `${environment.apiUrl}/user/service/all`;
      return this.http.get(url);
    }

    getServicioProductor(id:number): Observable<any>{
      let url =  `${environment.apiUrl}/user/service/${id}`;
      return this.http.get(url);
    }

    postServicioByProductor(body: any, productorId: number){
      let url = `${environment.apiUrl}/user/service`
      return this.http.post(url, body);
    }

    // BACK OFFICE

    getServicios(): Observable<any>{
      let url =  `${environment.apiUrl}/dist/service/all`;
      return this.http.get(url);
    }

    getServiciosFiltrados(pageSize: number): Observable<any>{
      let url =  `${environment.apiUrl}/dist/service/all?sortBy=id&sortDir=DESC&pageSize=${pageSize}&pageNo=0&nickname=op&code=3&model=&brand=&isActive=true`;
      return this.http.get(url);
    }

    getServicio(id:number): Observable<any>{
      let url =  `${environment.apiUrl}/dist/service/${id}`;
      return this.http.get(url);
    }

    getTecnico(idServicio: number){
      let url =  `${environment.apiUrl}/dist/service/${idServicio}/jobtechnical`;
      return this.http.get(url);
    }

    getInsumosTecnico(idServicio: number){
      let url =  `${environment.apiUrl}/dist/service/${idServicio}/jobtechnical/application/all`;
      return this.http.get(url);
    }

    postDatosTecnicos(servicioId: number, body: any){
      let url = `${environment.apiUrl}/dist/service/${servicioId}/jobtechnical/application`
      return this.http.post(url, body);
    }

    postServicio(body: any){
      let url = `${environment.apiUrl}/dist/service`
      return this.http.post(url, body);
    }

    putServicio(body: any , id: number){
      let url = `${environment.apiUrl}/dist/service/${id}`
      return this.http.put(url, body);
    }

  }
