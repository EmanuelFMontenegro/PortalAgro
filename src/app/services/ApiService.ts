import { HttpClient, HttpHeaders, HttpResponse, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = 'http://localhost:8095/api';

  constructor(private http: HttpClient) { }

  // Métodos de autenticación
  registrarUsuario(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/register`, { username, password });
  }

  validarCredenciales(username: string, password: string): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(`${this.baseURL}/auth/login`, { username, password }, { observe: 'response' });
  }

  refreshToken(token: string): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/refresh`, { token });
  }

   // <--ENPOINTS DE E-MAIL -->

  recuperarContrasena(email: string): Observable<any> {
    return this.http.post(`${this.baseURL}/email/recovery`, { mailTo: email });
  }

  cambiarContrasena(password: string, confirmPassword: string, token: string): Observable<any> {
    return this.http.post(`${this.baseURL}/email/change-pass`, { password, confirmPassword, token });
  }

  // <--ENPOINTS DE USERS -->

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseURL}/user`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseURL}/user/${id}`);
  }

  deleteUserById(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/user/${id}`);
  }

  // <--ENPOINTS DE PERSONA -->

  getPeopleAdmin(sortBy: string = 'id', sortDir: string = 'DESC'): Observable<any> {
    const url = `${this.baseURL}/person?sortBy=${sortBy}&sortDir=${sortDir}`;
    return this.http.get<any>(url);
  }

  getPeopleUserAdmin(sortBy: string = 'id', sortDir: string = 'DESC'): Observable<any> {
    const url = `${this.baseURL}/user/person/all?sortBy=${sortBy}&sortDir=${sortDir}`;
    return this.http.get<any>(url);
  }

  getPersonByIdOperador(userId: number, personId: number): Observable<any> {
    const url = `${this.baseURL}/user/${userId}/person/${personId}`;
    return this.http.get<any>(url);
  }

  getProfileOperador(userId: number, personId: number): Observable<any> {
    const url = `${this.baseURL}/user/${userId}/person/${personId}/profile`;
    return this.http.get<any>(url);
  }

  getPersonByDniCuitAdmin(dniCuit: string): Observable<any> {
    const url = `${this.baseURL}/user/person/${dniCuit}`;
    return this.http.get<any>(url);
  }

  existsPersonByParamsAdmin(dniCuit: string): Observable<any> {
    const url = `${this.baseURL}/user/person?dniCuit=${dniCuit}`;
    return this.http.get<any>(url);
  }

  updatePersonAdmin(userId: number, personId: number, personData: any): Observable<any> {
    const url = `${this.baseURL}/user/${userId}/person/${personId}`;
    return this.http.put<any>(url, personData);
  }



//  <<<<-------METODOS PARA CAMPOS------>>>>>

  getFields(userId: number): Observable<any> {
    return this.http.get(`${this.baseURL}/user/${userId}/field`);
  }

  getUsersFields(pageNo: number, pageSize: number, sortBy: string, sortDir: string): Observable<any> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get(`${this.baseURL}/user/field/`, { params });
  }

  getUsersFieldsDEF(): Observable<any> {
    const params = new HttpParams()
      .set('pageNo', '2')
      .set('pageSize', '5')
      .set('sortBy', 'id')
      .set('sortDir', 'desc')
      .set('disabled', 'true');

    return this.http.get(`${this.baseURL}/user/field/`, { params });
  }

  getOneField(userId: number, fieldId: number): Observable<any> {
    return this.http.get(`${this.baseURL}/user/${userId}/field/${fieldId}`);
  }

  addField(userId: number, newFieldData: any): Observable<any> {
    return this.http.post(`${this.baseURL}/user/${userId}/field`, newFieldData);
  }

  updateField(userId: number, fieldId: number, updatedFieldData: any): Observable<any> {
    return this.http.put(`${this.baseURL}/user/${userId}/field/${fieldId}`, updatedFieldData);
  }

  deleteField(userId: number, fieldId: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/user/${userId}/field/${fieldId}`);
  }


  // Métodos relacionados con Geolocalizacion

  getGeolocationField(userId: number, fieldId: number): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/user/${userId}/field/${fieldId}/geolocation`);
  }

  updateGeolocationField(userId: number, fieldId: number, geolocation: string): Observable<any> {
    const body = {
      geolocation: geolocation
    };

    return this.http.put<any>(`${this.baseURL}/user/${userId}/field/${fieldId}/geolocation`, body);
  }

  getFieldsPaged(userId: number, pageNo: number, pageSize: number, sortBy: string, sortDir: string): Observable<any> {
    return this.http.get(`${this.baseURL}/user/${userId}/field?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  // Métodos relacionados con Tipos de Servicios

  getAllTypeServices(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/field/service/type`);
  }

  getAllTypeServicesAdmin(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/field/service/type/all?isActive=true`);
  }

  addTypeService(typeService: any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/field/service/type`, typeService);
  }

  updateTypeService(typeServiceId: number, updatedTypeService: any): Observable<any> {
    return this.http.put<any>(`${this.baseURL}/field/service/type/${typeServiceId}`, updatedTypeService);
  }

  activateTypeService(typeServiceId: number, activationData: any): Observable<any> {
    return this.http.put<any>(`${this.baseURL}/field/service/type/${typeServiceId}/active`, activationData);
  }

  deleteTypeService(typeServiceId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/field/service/type/${typeServiceId}`);
  }

  // Métodos relacionados con AppServices

  getAllAppServices(fieldId: number): Observable<any> {
    return this.http.get(`${this.baseURL}/user/field/${fieldId}/service`);
  }

  addAppService(fieldId: number, serviceData: any): Observable<any> {
    return this.http.post(`${this.baseURL}/user/field/${fieldId}/service`, serviceData);
  }

  getAppServiceById(fieldId: number, serviceId: number): Observable<any> {
    return this.http.get(`${this.baseURL}/user/field/${fieldId}/service/${serviceId}`);
  }

  updateAppService(fieldId: number, serviceId: number, serviceData: any): Observable<any> {
    return this.http.put(`${this.baseURL}/user/field/${fieldId}/service/${serviceId}`, serviceData);
  }

  deleteAppService(fieldId: number, serviceId: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/user/field/${fieldId}/service/${serviceId}`);
  }

  // Métodos relacionados con Tipos de localidades
  getLocationMisiones(location: string): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/${location}`);
  }

  getLocationMisionesParams(name: string, sortDir: string): Observable<any> {
    const params = { name: name, sortDir: sortDir };
    return this.http.get<any>(this.baseURL, { params: params });
  }

  addPullLocationMisiones(locations: any[]): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/all`, locations);
  }

  addLocationMisiones(location: any): Observable<any> {
    return this.http.post<any>(this.baseURL, location);
  }

  updateLocationMisiones(location: any): Observable<any> {
    return this.http.put<any>(`${this.baseURL}/${location.id}`, location);
  }

  getLocationID(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/${id}`);
  }

  // Métodos adicionales
  getPruebaCambioIdioma(): Observable<any> {
    return this.http.get(`${this.baseURL}/person/demo`);
  }
}
