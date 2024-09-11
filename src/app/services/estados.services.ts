import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})

export class EstadosService {

  constructor(private http: HttpClient){}

  getAll_backOffice(): Observable<any>{
    let url =  `${environment.apiUrl}/status/all`;
    return this.http.get(url);
  }


}
