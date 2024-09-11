import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})

export class PilotosService {

  constructor(private http: HttpClient){}

  getAll_backOffice(): Observable<any>{
    let url =  `${environment.apiUrl}/dist/user/operator/all`;
    return this.http.get(url);
  }

  asignarPiloto(idServicio: number, idPiloto: number): Observable<any>{
    let url =  `${environment.apiUrl}/dist/service/${idServicio}/joboperator/assigned/${idPiloto}`;
    return this.http.post(url, null);
  }



}
