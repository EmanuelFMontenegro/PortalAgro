import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class calendarService {
    private baseURL = environment.apiUrl;
    constructor(private http: HttpClient){}


    getProducerCalendar(){
      return this.http.get(`${this.baseURL}/user/service/calendar/all`);

    }

    
  }