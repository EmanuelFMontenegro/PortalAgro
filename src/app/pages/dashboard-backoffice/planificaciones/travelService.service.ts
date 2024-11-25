import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TravelService {
  private baseURL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // Método para obtener la lista de servicios "For Travel" en el Backoffice
  getServicesForTravel(
    sortBy: string = 'id',
    sortDir: string = 'DESC',
    pageSize: number = 1000,
    pageNo: number = 0
  ): Observable<any> {
    const url = `${this.baseURL}/dist/service/fortravel`;
    const params = new HttpParams()
      .set('sortBy', sortBy)
      .set('sortDir', sortDir)
      .set('pageSize', pageSize.toString())
      .set('pageNo', pageNo.toString());

    return this.http.get<any>(url, { params });
  }

  // Método para obtener los suministros relacionados con servicios específicos
  getSuppliesForServices(servicesIds: string): Observable<any> {
    const url = `${this.baseURL}/dist/service/fortravel/supplies`;
    const params = new HttpParams().set('services_ids', servicesIds);

    return this.http.get<any>(url, { params });
  }
}
