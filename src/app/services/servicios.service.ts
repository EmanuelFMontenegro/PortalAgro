import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Piloto } from "../models/servicios.models";

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private empresaCotizar = new BehaviorSubject<any>(null);
  getEmprezaCotizar = this.empresaCotizar.asObservable();

  constructor(private http: HttpClient) {}

  getServicios(): Observable<any> {
    let url = `${environment.apiUrl}/dist/service/all`;
    return this.http.get(url);
  }

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


    getAllStatus(): Observable<any> {
      let url = `${environment.apiUrl}/status/all`;
      return this.http.get(url, {
        params: {
          sortBy: 'id',
          sortDir: 'ASC',
          pageSize: '10',
          pageNo: '0',
        },
      });
    }

    getStatusById(id: number): Observable<any> {
      let url = `${environment.apiUrl}/status/${id}`;
      return this.http.get(url);
    }

    putAprovedService(body: any, serviceId: number): Observable<any> {
      let url = `${environment.apiUrl}/dist/service/${serviceId}/approved`;
      return this.http.put(url, body);
    }


    getServicio(id:number): Observable<any>{
      let url =  `${environment.apiUrl}/dist/service/${id}`;
      return this.http.get(url);
    }

    postServicio(body: any){
      let url = `${environment.apiUrl}/dist/service`
      return this.http.post(url, body);
    }

    putServicio(body: any , id: number){
      let url = `${environment.apiUrl}/dist/service/${id}`
      return this.http.put(url, body);
    }

    // TECNICO

    getTecnico(idServicio: number){
      let url =  `${environment.apiUrl}/dist/service/${idServicio}/jobtechnical`;
      return this.http.get(url);
    }

    putDatosTecnico(idServicio:number, body: any){
      let url =  `${environment.apiUrl}/dist/service/${idServicio}/jobtechnical`;
      return this.http.put(url, body);
    }

    getPriporidades(): Observable<any>{
      let url =  `${environment.apiUrl}/priority/all`
      return this.http.get(url);
    }

    getInsumosTecnico(idServicio: number){
      let url =  `${environment.apiUrl}/dist/service/${idServicio}/jobtechnical/application/all`;
      return this.http.get(url);
    }

    getImagenesTecnico(idServicio: number){
      let url =  `${environment.apiUrl}/dist/service/${idServicio}/jobtechnical/images/all`;
      return this.http.get(url);
    }

    getImagenTecnicoById(idServicio: number, idImagen:number){
      let url =  `${environment.apiUrl}/dist/service/${idServicio}/jobtechnical/images/${idImagen}/img`;
      return this.http.get(url);
    }

    deleteImagenTecnico(idServicio: number , idInsumo: number){
      let url =  `${environment.apiUrl}/dist/service/${idServicio}/jobtechnical/images/${idInsumo}`;
      return this.http.delete(url);
    }

    postImagenTecnico(idServicio: number, file:any){
      const formData = new FormData();
      formData.append('title', file?.title);
      formData.append('description', file?.description);
      formData.append('imageJob', file?.imageJob);

      let url = `${environment.apiUrl}/dist/service/${idServicio}/jobtechnical/images`;
      return this.http.post(url, formData);
    }


    deleteInsumosTecnico(idServicio: number , idInsumo: number){
      let url =  `${environment.apiUrl}/dist/service/${idServicio}/jobtechnical/application/${idInsumo}`;
      return this.http.delete(url);
    }

    postDatosTecnicos(servicioId: number, body: any){
      let url = `${environment.apiUrl}/dist/service/${servicioId}/jobtechnical/application`
      return this.http.post(url, body);
    }

    putInsumosServicio(idServicio: number , idInsumo: number, insumo: any){
      let url =  `${environment.apiUrl}/dist/service/${idServicio}/jobtechnical/application/${idInsumo}`;
      return this.http.put(url,insumo);
    }

    // PILOTO
    getApp(idServicio: number): Observable<Piloto>{
      let url =  `${environment.apiUrl}/dist/service/${idServicio}/joboperator`;
      return this.http.get(url);
    }

    putDatosApp(idServicio:number, body: any){
      let url =  `${environment.apiUrl}/dist/service/${idServicio}/joboperator`;
      return this.http.put(url, body);
    }

    putInsumoApp(idServicio: number , idInsumo: number, body: any){
      let url =  `${environment.apiUrl}/dist/service/${idServicio}/joboperator/application/${idInsumo}/productinput`;
      return this.http.put(url, body);
    }

}
