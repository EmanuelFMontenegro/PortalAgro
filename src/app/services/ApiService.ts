import { HttpClient, HttpHeaders, HttpResponse, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = 'http://localhost:8095/api';

  constructor(private http: HttpClient) { }

  // < -- Métodos de autenticación Auth -- >
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

  //  <<<<-------METODOS PARA ROLES------>>>>>
    // GET: getRoles-ADMIN
  getRolesAdmin(): Observable<any> {
    const url = `${this.baseURL}`;
    return this.http.get(url);
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


  // <<<<-------METODOS PARA GEOLOCALIZACION------>>>>>

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

   // <<<<-------METODOS PARA LOCALIDADES------>>>>>

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

  // <<<<-------METODOS DE IDIOMAS------>>>>>

  getPruebaCambioIdioma(): Observable<any> {
    return this.http.get(`${this.baseURL}/person/demo`);
  }

  // <<<<-------METODOS PARA PLANTACION------>>>>>

  // GET: getAllTypePlantation-OPERADOR
  getAllTypePlantationOperador(): Observable<any> {
    const url = `${this.baseURL}/type`;
    return this.http.get(url);
  }

  // GET: getAllTypePlantationADMIN
  getAllTypePlantationAdmin(): Observable<any> {
    const url = `${this.baseURL}/all?isActive=true`;
    return this.http.get(url);
  }

  // POST: AddTypePlantation-ADMIN
  addTypePlantationAdmin(data: any): Observable<any> {
    const url = `${this.baseURL}/type`;
    return this.http.post(url, data);
  }

  // PUT: updateTypePlantation-ADMIN
  updateTypePlantationAdmin(id: number, data: any): Observable<any> {
    const url = `${this.baseURL}/type/${id}`;
    return this.http.put(url, data);
  }

  // PUT: activeTypePlantationById-ADMIN
  activeTypePlantationAdmin(id: number): Observable<any> {
    const url = `${this.baseURL}/type/${id}/active`;
    return this.http.put(url, {});
  }

  // DELETE: deleteTypePlantation-ADMIN
  deleteTypePlantationAdmin(id: number): Observable<any> {
    const url = `${this.baseURL}/type/${id}`;
    return this.http.delete(url);
  }

  // < ---- METODOS PARA LOTES --- >

  // GET: getAll-Plots-OPERADOR
  getAllPlotsOperador(userId: number, fieldId?: number): Observable<any> {
    const url = fieldId
      ? `${this.baseURL}/user/${userId}/field/${fieldId}/plot`
      : `${this.baseURL}/user/${userId}/plot`;

    return this.http.get(url);
  }



  // GET: getAll-Plots-ADMIN
getAllPlotsAdmin(userId: number, fieldId: number): Observable<any> {
  const url = `${this.baseURL}/user/${userId}/field/${fieldId}/plot/all`;
  return this.http.get(url);
}



  // POST: add-Plots-OPERADOR
  addPlotOperador(data: any): Observable<any> {
    const url = `${this.baseURL}`;
    return this.http.post(url, data);
  }

  // PUT: update-Plots-OPERADOR
  updatePlotOperador(id: number, data: any): Observable<any> {
    const url = `${this.baseURL}/${id}`;
    return this.http.put(url, data);
  }

  // DELETE: delete-LOGICAL-Plots-OPERADOR
  deleteLogicalPlotOperador(id: number): Observable<any> {
    const url = `${this.baseURL}/${id}`;
    return this.http.delete(url);
  }

  // PUT: activate-Plots-ADMIN
  activatePlotAdmin(id: number): Observable<any> {
    const url = `${this.baseURL}/${id}/activate`;
    return this.http.put(url, {});
  }

  // GET: get-PlotsById-OPERADOR
  getPlotByIdOperador(id: number): Observable<any> {
    const url = `${this.baseURL}/${id}`;
    return this.http.get(url);
  }

  // < -- METODO PARA SERVICIOS -- >

  // GET: getAllTypeServices-OPERADOR
  getAllTypeServicesOperador(): Observable<any> {
    const url = `${this.baseURL}`;
    return this.http.get(url);
  }

  // GET: getAllTypeServicesADMIN
  getAllTypeServicesAdmin(): Observable<any> {
    const url = `${this.baseURL}/all?isActive=true`;
    return this.http.get(url);
  }

  // POST: AddTypeServices-ADMIN
  addTypeServicesAdmin(data: any): Observable<any> {
    const url = `${this.baseURL}`;
    return this.http.post(url, data);
  }

  // PUT: updateTypeServices-ADMIN
  updateTypeServicesAdmin(id: number, data: any): Observable<any> {
    const url = `${this.baseURL}/${id}`;
    return this.http.put(url, data);
  }

  // PUT: activeTypeServicesById-ADMIN
  activeTypeServicesByIdAdmin(id: number): Observable<any> {
    const url = `${this.baseURL}/${id}/active`;
    return this.http.put(url, {});
  }

  // DELETE: deleteTypeServices-ADMIN
  deleteTypeServicesAdmin(id: number): Observable<any> {
    const url = `${this.baseURL}/${id}`;
    return this.http.delete(url);
  }

  // < -- Metodo Pedidos de Servicios -- >
  // GET: getAllPedidoServices-ADMIN
  getAllPedidoServicesAdmin(): Observable<any> {
    const url = `${this.baseURL}`;
    return this.http.get(url);
  }

  // POST: addPedidoSericio-OPERADOR
  addPedidoSericioOperador(data: any): Observable<any> {
    const url = `${this.baseURL}`;
    return this.http.post(url, data);
  }

  // GET: getOnePedidoServicesApp-OPERADOR
  getOnePedidoServicesAppOperador(id: number): Observable<any> {
    const url = `${this.baseURL}/${id}`;
    return this.http.get(url);
  }

  // DELETE: deletePedidoServicesApp-OPERADOR
  deletePedidoServicesAppOperador(id: number): Observable<any> {
    const url = `${this.baseURL}/${id}`;
    return this.http.delete(url);
  }

  // GET: getAllPedidoServicesByField-OPERADOR
  getAllPedidoServicesByFieldOperador(): Observable<any> {
    const url = `${this.baseURL}`;
    return this.http.get(url);
  }

  // PUT: updatePedidoServices-OPERADOR
  updatePedidoServicesOperador(id: number, data: any): Observable<any> {
    const url = `${this.baseURL}/${id}`;
    return this.http.put(url, data);
  }
}
