import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

  getServiciosByProductor(): Observable<any> {
    // let url =  `${environment.apiUrl}/user/${id}/service/all`;
    let url = `${environment.apiUrl}/user/service/all`;
    return this.http.get(url);
  }

  getServicio(id: number): Observable<any> {
    let url = `${environment.apiUrl}/dist/service/${id}`;
    return this.http.get(url);
  }

  getServicioProductor(id: number): Observable<any> {
    let url = `${environment.apiUrl}/user/service/${id}`;
    return this.http.get(url);
  }

  getServiciosFiltrados(pageSize: number): Observable<any> {
    let url = `${environment.apiUrl}/dist/service/all?sortBy=id&sortDir=DESC&pageSize=${pageSize}&pageNo=0&nickname=op&code=3&model=&brand=&isActive=true`;
    return this.http.get(url);
  }

  postServicio(body: any) {
    let url = `${environment.apiUrl}/dist/service`;
    return this.http.post(url, body);
  }

  postServicioByProductor(body: any, productorId: number) {
    let url = `${environment.apiUrl}/user/service`;
    return this.http.post(url, body);
  }

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

  putServicio(body: any, id: number) {
    let url = `${environment.apiUrl}/dist/service/${id}`;
    return this.http.put(url, body);
  }

  putAprovedService(body: any, serviceId: number): Observable<any> {
    let url = `${environment.apiUrl}/dist/service/${serviceId}/approved`;
    return this.http.put(url, body);
  }
}
