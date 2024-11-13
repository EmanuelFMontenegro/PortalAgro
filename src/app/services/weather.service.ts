import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
  })

  export class WeatherService {
    private url =`${environment.apiUrl}/climate/forecast?`

    constructor(private http: HttpClient){}


    getWeather(): Observable<any>{
        const latitude = -27.405;
        const longitude = -55.9825;
        return this.http.get(`${this.url}latitude=${latitude}&longitude=${longitude}`)
    }
  }