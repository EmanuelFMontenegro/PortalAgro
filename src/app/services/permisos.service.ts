import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PermisosUsuario } from "../models/permisos.model";

@Injectable({
  providedIn: 'root'
})

export class PermisoService {

  constructor(private http: HttpClient) { }

  private baseURL = environment.apiUrl;
  public  permisoUsuario = new BehaviorSubject<PermisosUsuario>({});

  /** Servicio HTTP que recupera los permisos para el usuario en base al token */
  getMyPermissions(): Observable<any> {
    const url = `${this.baseURL}/role/permissions/my`;
    return this.http.get<any>(url);
  }

  /** Promesa que devuelve los permisos del usuario */
  async getPermisos() {
    return new Promise<any>(async (resolve) => {
      await this.getMyPermissions().toPromise().then(
        response => {
          this.permisoUsuario.next(response)
          resolve(response)
        },
        error => {
          resolve(null)
        });
    })
  }

}
