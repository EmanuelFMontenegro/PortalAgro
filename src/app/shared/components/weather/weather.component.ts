import { Component, Input, OnInit } from '@angular/core';   
import { finalize, Subject, takeUntil } from 'rxjs';
import { WeatherService } from 'src/app/services/weather.service';
@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html'
})
/* Componente principal, la idea es que si mas adelante se usan otros endpoint o se buscan dias en un rango
    mayor , se agreguén como inputs y el componente lo manejara, 
    tambien se puede filtrar por dia que se necesita ej solamente el dia de hoy, en un input mandamos
    selectedDay : 'today'
    y lo filtrariamos  por medio de un pipe o directamente en el componente,
    actualmente trae solamente de un service y que no esta conectado a la api
    para el dia actual enviamos Location ya que tiene un formato distinto el widget*/
export class WeatherComponent implements OnInit { 
  @Input() selectedDays: any;
  private destroy$ = new Subject<void>();
  public weather: any = {};
  public todayWeather: any = {};
  public location: any = {};
  public forecastToday: any = {};
  public loading = true;

  constructor(private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.getWeather(); 
  }

  getWeather() {
    this.weatherService.getWeather().pipe(
      finalize(() => this.loading = false),
      takeUntil(this.destroy$)).subscribe((response: any) => {
      this.weather = response;
      this.location = this.weather.location;
      this.forecastToday = {...this.weather.forecast.forecastday[0], ...this.weather.current};  

    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
