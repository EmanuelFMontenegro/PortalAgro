import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // < -- Métodos de autenticación Auth -- >

  registrarUsuario(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/register`, {
      username,
      password,
    });
  }

  validarCredenciales(
    username: string,
    password: string
  ): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(
      `${this.baseURL}/auth/login`,
      { username, password },
      { observe: 'response' }
    );
  }

  validarCredencialBackoffice(
    username: string,
    password: string
  ): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(
      `${this.baseURL}/dist/auth/login`, // URL corregida
      { username, password },
      { observe: 'response' } // Observar la respuesta completa
    );
  }

  refreshToken(token: string): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/refresh`, { token });
  }

  //<------- Enpoint Terminos Y condiciones-------->
  acceptLicense(userId: number, personId: number): Observable<any> {
    const requestData = {
      accept_license: true,
    };

    return this.http.put(
      `${this.baseURL}/user/${userId}/person/${personId}`,
      requestData
    );
  }

  // Métodos relacionados con el backoffice (Admin-Opertator-all)

  loginBackoffice(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseURL}/dist/auth/login`, {
      username,
      password,
    });
  }

  recuperarContrasenaBackoffice(email: string): Observable<any> {
    return this.http.post(`${this.baseURL}/dist/auth/recovery`, {
      mailTo: email,
    });
  }

  cambiarContrasenaBackoffice(
    password: string,
    confirmPassword: string,
    token: string
  ): Observable<any> {
    return this.http.post(`${this.baseURL}/dist/auth/change-pass`, {
      password,
      confirmPassword,
      token,
    });
  }

  // Métodos de prueba (Dev-login y Dev-login DNS)

  devLogin(): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/login`, {
      // Inserta los datos necesarios para el login de prueba
    });
  }

  devLoginDNS(): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/login`, {
      // Inserta los datos necesarios para el login DNS de prueba
    });
  }

  // <--ENPOINTS DE E-MAIL -->

  recuperarContrasena(email: string): Observable<any> {
    return this.http.post(`${this.baseURL}/email/recovery`, { mailTo: email });
  }

  cambiarContrasena(
    password: string,
    confirmPassword: string,
    token: string
  ): Observable<any> {
    return this.http.post(`${this.baseURL}/email/change-pass`, {
      password,
      confirmPassword,
      token,
    });
  }

  // <----------------USUARIOS  ADMINISTRADORES -------------------------------------->

  // Eliminar un usuario de la compañía por ID
  deleteUserCompany(companyId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/dist/${companyId}/user/${userId}`);
  }

  // Deshabilitar lógicamente un usuario de la compañía por ID
  disableUserCompany(companyId: number, userId: number): Observable<any> {
    return this.http.delete(
      `${this.baseURL}/dist/${companyId}/user/${userId}/disabled`
    );
  }

  // Encontrar un usuario por ID
  findUserById(companyId: number, userId: number): Observable<any> {
    return this.http.get(`${this.baseURL}/dist/${companyId}/user/${userId}`);
  }

  // Obtener todos los usuarios administradores de una compañía
  getAdministratorUsers(companyId: number): Observable<any> {
    return this.http.get(`${this.baseURL}/dist/${companyId}/user/all`);
  }

  // Agregar un nuevo administrador a una compañía
  addAdministrator(companyId: number, adminData: any): Observable<any> {
    return this.http.post(`${this.baseURL}/dist/${companyId}/user`, adminData);
  }

  // Actualizar información de un administrador por ID en una compañía
  updateAdministrator(
    companyId: number,
    userId: number,
    adminData: any
  ): Observable<any> {
    return this.http.put(
      `${this.baseURL}/dist/${companyId}/user/${userId}`,
      adminData
    );
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

  actualizarImagenDePerfil(userId: number, file: File) {
    const formData = new FormData();
    formData.append('files', file);

    return this.http.put(`http://localhost:8095/api/user/${userId}/profile/image`, formData);
  }

  getProfileImage(userId: number): Observable<any> {
    return this.http.get(
      `${this.baseURL}/user/${userId}/profile/image`,
      { responseType: 'blob' }
    );
  }

  getPeopleAdmin(locationId?: number): Observable<any> {
    let params = new HttpParams();
    if (locationId) {
      params = params.set('locationId', locationId.toString());
    }

    return this.http.get<any>(`${this.baseURL}/dist/person`, { params: params });
  }


  getPeopleUserAdmin(filter: any): Observable<any> {
    const url = `${this.baseURL}/dist/user/person/all`;
    return this.http.get<any>(url, { params: filter });
  }




  getPersonByIdOperador(userId: number, personId: number): Observable<any> {
    const url = `${this.baseURL}/user/${userId}/person/${personId}`;
    return this.http.get<any>(url);
  }

  getProfileOperador(userId: number, personId: number): Observable<any> {
    const url = `${this.baseURL}/user/${userId}/person/${personId}/profile`;
    return this.http.get<any>(url);
  }

  getPersonByDniAdmin(dniCuit: string): Observable<any> {
    const url = `${this.baseURL}/dist/user/person/${dniCuit}`;
    return this.http.get<any>(url);
  }

  existsPersonByParamsAdmin(dniCuit: string): Observable<any> {
    const url = `${this.baseURL}/dist/user/person?dniCuit=${dniCuit}`;
    return this.http.get<any>(url);
  }

  updatePersonAdmin(
    userId: number,
    personId: number,
    personData: any
  ): Observable<any> {
    const updatedPersonData = { ...personData, accept_license: true };
    const url = `${this.baseURL}/user/${userId}/person/${personId}`;
    return this.http.put<any>(url, updatedPersonData);
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

  getUsersFields(
    pageNo: number,
    pageSize: number,
    sortBy: string,
    sortDir: string,
    isActive: boolean = true,
    producerNames: string = '',
    fieldName: string = '',
    locationId: number | null = null,
    personId: number | null = null,
    dimMin: number | null = null,
    dimMax: number | null = null
  ): Observable<any> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir)
      .set('isActive', isActive.toString())
      .set('producerNames', producerNames)
      .set('filedName', fieldName)
      .set('locationId', locationId ? locationId.toString() : '')
      .set('person_id', personId ? personId.toString() : '')
      .set('dimMin', dimMin ? dimMin.toString() : '')
      .set('dimMax', dimMax ? dimMax.toString() : '');

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

  updateField(
    userId: number,
    fieldId: number,
    updatedFieldData: any
  ): Observable<any> {
    return this.http.put(
      `${this.baseURL}/user/${userId}/field/${fieldId}`,
      updatedFieldData
    );
  }

  deleteField(userId: number, fieldId: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/user/${userId}/field/${fieldId}`);
  }

  // <<<<-------METODOS PARA GEOLOCALIZACION------>>>>>

  getGeolocationField(userId: number, fieldId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseURL}/user/${userId}/field/${fieldId}/geolocation`
    );
  }

  updateGeolocationField(
    userId: number,
    fieldId: number,
    geolocation: string
  ): Observable<any> {
    const body = {
      geolocation: geolocation,
    };

    return this.http.put<any>(
      `${this.baseURL}/user/${userId}/field/${fieldId}/geolocation`,
      body
    );
  }

  getFieldsPaged(
    userId: number,
    pageNo: number,
    pageSize: number,
    sortBy: string,
    sortDir: string
  ): Observable<any> {
    return this.http.get(
      `${this.baseURL}/user/${userId}/field?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
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

  // <<<<-------METODOS DE PLANTACIONS ------>>>>>

  // GET: getAllTypeCrop-OPERADOR
  getAllTypeCropOperador(): Observable<any> {
    const url = `${this.baseURL}/field/crop/type`;
    return this.http.get(url);
  }

  // GET: getAllTypeCropADMIN
  getAllTypeCropAdmin(isActive: boolean = false): Observable<any> {
    const url = `${this.baseURL}/field/crop/all?isActive=${isActive}`;
    return this.http.get(url);
  }

  // POST: AddTypeCrop-ADMIN
  addTypeCropAdmin(data: any): Observable<any> {
    const url = `${this.baseURL}/field/crop/type`;
    return this.http.post(url, data);
  }

  // PUT: updateTypeCrop-ADMIN
  updateTypeCropAdmin(id: number, data: any): Observable<any> {
    const url = `${this.baseURL}/field/crop/type/${id}`;
    return this.http.put(url, data);
  }

  // PUT: activeTypeCropById-ADMIN
  activeTypeCropByIdAdmin(id: number): Observable<any> {
    const url = `${this.baseURL}/field/plantation/type/${id}/active`;
    return this.http.put(url, {});
  }

  // DELETE: deleteTypeCrop-ADMIN
  deleteTypeCropAdmin(id: number): Observable<any> {
    const url = `${this.baseURL}/field/crop/type/${id}`;
    return this.http.delete(url);
  }

  // < ---- METODOS PARA LOTES --- >

  // Obtener todos los lotes para un operador
  getPlotsOperador(userId: number, fieldId: number): Observable<any> {
    return this.http.get(
      `${this.baseURL}/user/${userId}/field/${fieldId}/plot`
    );
  }

  // Obtener todos los lotes para un administrador
  getAllPlotsAdmin(
    pageSize: number | undefined = undefined,
    pageNo: number | undefined = undefined,
    sortDir: string | undefined = undefined,
    sortBy: string | undefined = undefined,
    producerNames: string | undefined = undefined,
    dimMin: string | undefined = undefined,
    dimMax: string | undefined = undefined,
    cropId: string | undefined = undefined,
    isActive: boolean | undefined = undefined,
    locationId: number | undefined = undefined
  ): Observable<any> {
    const url = `${this.baseURL}/user/field/plot/all`;
    const params = new HttpParams()
      .set('pageSize', pageSize?.toString() || '')
      .set('pageNo', pageNo?.toString() || '')
      .set('sortDir', sortDir || '')
      .set('sortBy', sortBy || '')
      .set('producerNames', producerNames || '')
      .set('dimMin', dimMin || '')
      .set('dimMax', dimMax || '')
      .set('crop_id', cropId || '')
      .set('isActive', isActive?.toString() || '')
      .set('locationId', locationId?.toString() || '');

    return this.http.get(url, { params });
  }




  // Agregar un lote para un operador
  addPlotOperador(
    userId: number,
    fieldId: number,
    newPlotData: any
  ): Observable<any> {
    return this.http.post(
      `${this.baseURL}/user/${userId}/field/${fieldId}/plot`,
      newPlotData
    );
  }

  // Actualizar un lote para un operador
  updatePlotOperador(
    userId: number,
    fieldId: number,
    plotId: number,
    updatedPlotData: any
  ): Observable<any> {
    return this.http.put(
      `${this.baseURL}/user/${userId}/field/${fieldId}/plot/${plotId}`,
      updatedPlotData
    );
  }

  // Eliminar un lote de forma lógica para un operador
  deleteLogicalPlotOperador(
    userId: number,
    fieldId: number,
    plotId: number
  ): Observable<any> {
    return this.http.delete(
      `${this.baseURL}/user/${userId}/field/${fieldId}/plot/${plotId}`
    );
  }

  // Activar un lote para un administrador
  activatePlotAdmin(
    userId: number,
    fieldId: number,
    plotId: number
  ): Observable<any> {
    return this.http.put(
      `${this.baseURL}/user/${userId}/field/${fieldId}/plot/${plotId}/activate`,
      {}
    );
  }

  // Obtener un lote por ID para un operador
  getPlotByIdOperador(
    userId: number,
    fieldId: number,
    plotId: number
  ): Observable<any> {
    return this.http.get(
      `${this.baseURL}/user/${userId}/field/${fieldId}/plot/${plotId}`
    );
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
