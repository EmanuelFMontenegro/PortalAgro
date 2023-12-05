import { HttpClient,HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = 'http://localhost:8095/api';

  constructor(private http: HttpClient) { }

  validarCredenciales(username: string, password: string): Observable<HttpResponse<any>> {
    return this.http.post(`${this.baseURL}/auth/login`, { username, password }, { observe: 'response' });
  }

  registrarUsuario(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/register`, { username, password });
}


  recuperarContrasena(email: string): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(`${this.baseURL}/email/recovery`, { mailTo: email }, { observe: 'response' });
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

  // Métodos relacionados con Person
  getPeople(): Observable<any> {
    return this.http.get(`${this.baseURL}/person`);
  }

  getPersonById(id: number): Observable<any> {
    return this.http.get(`${this.baseURL}/person/${id}`);
  }

  addPerson(name: string, lastname: string, dni: string): Observable<any> {
    return this.http.post(`${this.baseURL}/person/1`, { name, lastname, dni });
  }

  updatePerson(name: string, lastname: string, dni: string): Observable<any> {
    return this.http.put(`${this.baseURL}/person/1`, { name, lastname, dni });
  }

  deletePerson(): Observable<any> {
    return this.http.delete(`${this.baseURL}/person/1`);
  }
}
