import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Piloto } from "../models/servicios.models";
import { ServicioInterno } from "../pages/servicios/servicios-interno.service";

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private empresaCotizar = new BehaviorSubject<any>(null);
  getEmprezaCotizar = this.empresaCotizar.asObservable();
  urlBase = ''
  backOffice = false;

  constructor(private http: HttpClient,
              private servicioInterno: ServicioInterno){
                this.servicioInterno.backOffice$.subscribe(
                  (value:any) => {
                    this.backOffice = value
                    this.urlBase = `${environment.apiUrl}${value ? '/dist': '/user'}`
                  }
                )
              }

    // getServiciosByProductor(): Observable<any>{
    //   let url =  `${this.urlBase}/service/all`;
    //   return this.http.get(url);
    // }

    // getServicioProductor(id:number): Observable<any>{
    //   let url =  `${this.urlBase}/service/${id}`;
    //   return this.http.get(url);
    // }

    // postServicioByProductor(body: any, productorId: number){
    //   let url = `${this.urlBase}/service`
    //   return this.http.post(url, body);
    // }

    // BACK OFFICE


    getAllStatus(): Observable<any> {
      let url = `${this.urlBase}/status/all`;
      return this.http.get(url, {
        params: {
          sortBy: 'id',
          sortDir: 'ASC',
          pageSize: '10',
          pageNo: '0',
        },
      })
    }

    getStatusByService(serviceId:number){
      let url = `${this.urlBase}/service/${serviceId}/status/edit`;
      return this.http.get(url);
    }

    putStatusByService(serviceId:number, statusId: number){
      // let url = `${environment.apiUrl}/dist/service/${serviceId}/status/${statusId}`;
      let url = `${this.urlBase}/service/${serviceId}/status/${statusId}`;
      return this.http.put(url, null);
    }

    getStatusById(id: number): Observable<any> {
      let url = `${this.urlBase}/status/${id}`;
      return this.http.get(url);
    }

    bajaServicio(id: number): Observable<any> {
      let url = `${this.urlBase}/service/${id}/disable`;
      return this.http.delete(url);
    }

    getServicios(): Observable<any>{
      let url =  `${this.urlBase}/service/all`;
      console.log(url)
      return this.http.get(url);
    }

    getServiciosFiltrados(pageSize: number): Observable<any>{
      let url =  `${this.urlBase}/service/all?sortBy=id&sortDir=DESC&pageSize=${pageSize}&pageNo=0&nickname=op&code=3&model=&brand=&isActive=true`;
      return this.http.get(url);
    }

    putAprovedService(body: any, serviceId: number): Observable<any> {
      let url = `${this.urlBase}/service/${serviceId}/approved`;
      return this.http.put(url, body);
    }


    getServicio(id:number): Observable<any>{
      let url =  `${this.urlBase}/service/${id}`;
      return this.http.get(url);
    }

    postServicio(body: any){
      let url = `${this.urlBase}/service`
      return this.http.post(url, body);
    }

    putServicio(body: any , id: number){
      let url = `${this.urlBase}/service/${id}`
      return this.http.put(url, body);
    }

    // TECNICO

    getTecnico(idServicio: number){
      let url =  `${this.urlBase}/service/${idServicio}/jobtechnical`;
      return this.http.get(url);
    }

    putDatosTecnico(idServicio:number, body: any){
      let url =  `${this.urlBase}/service/${idServicio}/jobtechnical`;
      return this.http.put(url, body);
    }

    getDronesTask(idServicio:number){
      let url =  `${this.urlBase}/service/${idServicio}/joboperator/dronetask/all`;
      return this.http.get(url);
    }

    postDroneTask(idServicio:number, body: any){
      let url = `${this.urlBase}/service/${idServicio}/joboperator/dronetask`;
      return this.http.post(url, body);
    }

    putDroneTask(idServicio:number, body: any, taskId: number){
      let url = `${this.urlBase}/service/${idServicio}/joboperator/dronetask/${taskId}`;
      return this.http.put(url, body);
    }

    getPriporidades(): Observable<any>{
      let url =  `${environment.apiUrl}/priority/all`
      return this.http.get(url);
    }

    getInsumosTecnico(idServicio: number){
      let url =  `${this.urlBase}/service/${idServicio}/jobtechnical/application/all`;
      return this.http.get(url);
    }

    getImagenesTecnico(idServicio: number){
      let url =  `${this.urlBase}/service/${idServicio}/jobtechnical/images/all`;
      return this.http.get(url);
    }

    getImagenTecnicoById(idServicio: number, idImagen:number){
      let url =  `${this.urlBase}/service/${idServicio}/jobtechnical/images/${idImagen}/img`;
      return this.http.get(url);
    }

    deleteImagenTecnico(idServicio: number , idInsumo: number){
      let url =  `${this.urlBase}/service/${idServicio}/jobtechnical/images/${idInsumo}`;
      return this.http.delete(url);
    }

    postImagenTecnico(idServicio: number, file:any){
      const formData = new FormData();
      formData.append('title', file?.title);
      formData.append('description', file?.description);
      formData.append('imageJob', file?.imageJob);

      let url = `${this.urlBase}/service/${idServicio}/jobtechnical/images`;
      return this.http.post(url, formData);
    }


    deleteInsumosTecnico(idServicio: number , idInsumo: number){
      let url =  `${this.urlBase}/service/${idServicio}/jobtechnical/application/${idInsumo}`;
      return this.http.delete(url);
    }

    postDatosTecnicos(servicioId: number, body: any){
      let url = `${this.urlBase}/service/${servicioId}/jobtechnical/application`
      return this.http.post(url, body);
    }

    putInsumosServicio(idServicio: number , idInsumo: number, insumo: any){
      let url =  `${this.urlBase}/service/${idServicio}/jobtechnical/application/${idInsumo}`;
      return this.http.put(url,insumo);
    }

    // PILOTO
    getApp(idServicio: number): Observable<Piloto>{
      let url =  `${this.urlBase}/service/${idServicio}/joboperator`;
      return this.http.get(url);
    }

    putDatosApp(idServicio:number, body: any){
      let url =  `${this.urlBase}/service/${idServicio}/joboperator`;
      return this.http.put(url, body);
    }

    putInsumoApp(idServicio: number , idInsumo: number, body: any){
      let url =  `${this.urlBase}/service/${idServicio}/joboperator/application/${idInsumo}/productinput`;
      return this.http.put(url, body);
    }

    deleteTareaDrone(idServicio: number , idTask: number){
      let url =  `${this.urlBase}/service/${idServicio}/joboperator/dronetask/${idTask}`;
      return this.http.delete(url);
    }


    getImagenesPiloto(idServicio: number){
      let url =  `${this.urlBase}/service/${idServicio}/joboperator/images/all`;
      return this.http.get(url);
    }

    getImagenPilotoById(idServicio: number, idImagen:number){
      let url =  `${this.urlBase}/service/${idServicio}/joboperator/images/${idImagen}/img`;
      return this.http.get(url);
    }


    deleteImagenPiloto(idServicio: number , idInsumo: number){
      let url =  `${this.urlBase}/service/${idServicio}/joboperator/images/${idInsumo}`;
      return this.http.delete(url);
    }

    postImagenPiloto(idServicio: number, file:any){
      const formData = new FormData();
      formData.append('title', file?.title);
      formData.append('description', file?.description);
      formData.append('imageJob', file?.imageJob);

      let url = `${this.urlBase}/service/${idServicio}/joboperator/images`;
      return this.http.post(url, formData);
    }


    // INFORMES
    getInformes(idServicio: number): Observable<any>{
      let url =  `${environment.apiUrl}/service/${idServicio}/info`;
      return this.http.get(url);
    }

    getInformeOrdeServicio(idServicio: number): Observable<any>{
      let url =  `${this.urlBase}/service/${idServicio}/order`;
      return this.http.get(url);
    }
    postInformeOrdeServicio(idServicio: number, body:any): Observable<any>{
      const formData = new FormData();
      formData.append('title', body?.title);
      formData.append('description', body?.description);
      formData.append('document', body?.document);

      let url =  `${this.urlBase}/service/${idServicio}/order`;
      return this.http.post(url, formData);
    }

    getInformeTecnico(idServicio: number): Observable<any>{
      let url =  `${this.urlBase}/service/${idServicio}/jobtechnical/report`;
      return this.http.get(url);
    }
    postInformeTecnico(idServicio: number, body:any): Observable<any>{
      const formData = new FormData();
      formData.append('title', body?.title);
      formData.append('description', body?.description);
      formData.append('document', body?.document);

      let url =  `${this.urlBase}/service/${idServicio}/jobtechnical/report`;
      return this.http.post(url, formData);
    }

    getInformeApp(idServicio: number): Observable<any>{
      let url =  `${this.urlBase}/service/${idServicio}/joboperator/report`;
      return this.http.get(url);
    }
    postInformeApp(idServicio: number, body:any): Observable<any>{
      const formData = new FormData();
      formData.append('title', body?.title);
      formData.append('description', body?.description);
      formData.append('document', body?.document);

      let url =  `${this.urlBase}/service/${idServicio}/joboperator/report`;
      return this.http.post(url, formData);
    }

    getInformeFinal(idServicio: number): Observable<any>{
      let url =  `${this.urlBase}/service/${idServicio}/report`;
      return this.http.get(url);
    }
    postInformeFinal(idServicio: number, body:any): Observable<any>{
      const formData = new FormData();
      formData.append('title', body?.title);
      formData.append('description', body?.description);
      formData.append('document', body?.document);

      let url =  `${this.urlBase}/service/${idServicio}/report`;
      return this.http.post(url, formData);
    }

  }
