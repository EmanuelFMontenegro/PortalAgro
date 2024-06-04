import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
  })

  export class ConfiguracionService {

    private empresaCotizar = new BehaviorSubject<any>(null);
    getEmprezaCotizar = this.empresaCotizar.asObservable();

    constructor(private http: HttpClient){}

    getDrones(): Observable<any>{
      let url =  `${environment.apiUrl}/dist/drone/all`;
      return this.http.get(url);
    }

  }
