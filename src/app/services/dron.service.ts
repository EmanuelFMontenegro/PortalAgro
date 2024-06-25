import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
  })

  export class DronService {

    private empresaCotizar = new BehaviorSubject<any>(null);
    getEmprezaCotizar = this.empresaCotizar.asObservable();
    constructor(private http: HttpClient){}

    getAll(): Observable<any>{
      let url =  `${environment.apiUrl}/dist/drone/all`;
      return this.http.get(url);
    }

    get(id:number): Observable<any>{
      let url =  `${environment.apiUrl}/dist/drone/${id}`;
      return this.http.get(url);
    }

    getFiltrados(pageSize: number): Observable<any>{
      let url =  `${environment.apiUrl}/dist/drone/all?sortBy=id&sortDir=DESC&pageSize=${pageSize}&pageNo=0&nickname=op&code=3&model=&brand=&isActive=true`;
      return this.http.get(url);
    }

    post(body: any){
      let url = `${environment.apiUrl}/dist/drone`
      return this.http.post(url, body);
    }

    put(body: any , id: number){
      let url = `${environment.apiUrl}/dist/drone/${id}`
      return this.http.put(url, body);
    }

  }
