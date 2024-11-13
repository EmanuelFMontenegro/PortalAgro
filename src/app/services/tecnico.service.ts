import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})

export class TecnicoService {

  constructor(private http: HttpClient){}

  getAll_backOffice(): Observable<any>{
    let url =  `${environment.apiUrl}/dist/user/technical/all`;
    return this.http.get(url);
  }

  getAll_backOfficeByLocation(idLocation: number): Observable<any>{
    let url =  `${environment.apiUrl}/dist/user/technical/all?locationId=${idLocation}`;
    return this.http.get(url);
  }

  asignarTecnico(idServicio: number, idTecnico: number): Observable<any>{
    let url =  `${environment.apiUrl}/dist/service/${idServicio}/jobtechnical/assigned/${idTecnico}`;
    return this.http.post(url, null);
  }

}
