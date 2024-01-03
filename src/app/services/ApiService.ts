import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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

  // Métodos relacionados con Email
  recuperarContrasena(email: string): Observable<any> {
    return this.http.post(`${this.baseURL}/email/recovery`, { mailTo: email });
  }

  cambiarContrasena(password: string, confirmPassword: string, token: string): Observable<any> {
    return this.http.post(`${this.baseURL}/email/change-pass`, { password, confirmPassword, token });
  }

  // Métodos relacionados con User
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseURL}/user`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseURL}/user/${id}`);
  }

  deleteUserById(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/user/${id}`);
  }

  // Métodos relacionados con Persona
  getPeople(): Observable<any> {
    return this.http.get(`${this.baseURL}/person`);
  }

  getPersonById(id: number): Observable<any> {
    return this.http.get(`${this.baseURL}/person/${id}`);
  }

  addPerson(name: string, lastname: string, dni: string): Observable<any> {
    return this.http.post(`${this.baseURL}/person`, { name, lastname, dni });
  }

  updatePerson(id: number, name: string, lastname: string, dni: string): Observable<any> {
    return this.http.put(`${this.baseURL}/person/${id}`, { name, lastname, dni });
  }

  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/person/${id}`);
  }

  // Métodos relacionados con Fields(registro de campos)
  getFields(userId: number): Observable<any> {
    return this.http.get(`${this.baseURL}/user/${userId}/field`);
  }

  getFieldById(userId: number, fieldId: number): Observable<any> {
    return this.http.get(`${this.baseURL}/user/${userId}/field/${fieldId}`);
  }

addField(userId: number, fieldData: any, httpOptions?: { headers: HttpHeaders }): Observable<any> {
  return this.http.post(`${this.baseURL}/user/${userId}/field`, fieldData, httpOptions);
}


  updateField(userId: number, fieldId: number, fieldData: any): Observable<any> {
    return this.http.put(`${this.baseURL}/user/${userId}/field/${fieldId}`, fieldData);
  }

  deleteField(userId: number, fieldId: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/user/${userId}/field/${fieldId}`);
  }

  // Métodos relacionados con Geolocalizacion
  getGeolocationField(userId: number, fieldId: number): Observable<any> {
    return this.http.get(`${this.baseURL}/user/${userId}/field/${fieldId}/geolocation`);
  }

  updateGeolocationField(userId: number, fieldId: number, geolocation: string): Observable<any> {
    return this.http.put(`${this.baseURL}/user/${userId}/field/${fieldId}/geolocation`, { geolocation });
  }

  getFieldsPaged(userId: number, pageNo: number, pageSize: number, sortBy: string, sortDir: string): Observable<any> {
    return this.http.get(`${this.baseURL}/user/${userId}/field?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  // Métodos relacionados con Tipos de Servicios
  getAllTypeServices(): Observable<any> {
    return this.http.get(`${this.baseURL}/user/field/service/type`);
  }

  addTypeService(serviceData: any): Observable<any> {
    return this.http.post(`${this.baseURL}/user/field/service/type`, serviceData);
  }

  updateTypeService(typeServiceId: number, serviceData: any): Observable<any> {
    return this.http.put(`${this.baseURL}/user/field/service/type/${typeServiceId}`, serviceData);
  }

  deleteTypeService(typeServiceId: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/user/field/service/type/${typeServiceId}`);
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

  // Métodos adicionales
  getPruebaCambioIdioma(): Observable<any> {
    return this.http.get(`${this.baseURL}/person/demo`);
  }
}

