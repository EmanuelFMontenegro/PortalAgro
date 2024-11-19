import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, ViewEncapsulation, } from '@angular/core';
import * as L from 'leaflet';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { FormControl} from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MapService } from 'src/app/services/map.service';
 
@Component({
  selector: 'app-chacras-geolocalizar',
  templateUrl: './chacras-geolocalizar.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ChacrasGeolocalizarComponent implements AfterViewInit {
  @ViewChild('map') private mapContainer!: ElementRef;
  private map!: L.Map;
  public currentMarker?: L.Marker;
  public opcionGeolocalizacion: string = 'localidad';
  public showManualCoordinatesInput: boolean = false;
  public latitud: number | null = null;
  public longitud: number | null = null;
  public filtroLocalidades = new FormControl('');
  public localidades: any[] = [];
  public chacraSeleccionada: any = {};
  public fieldHasGeolocation: boolean = false;
  public userId: number | null = null;
  constructor(
    private mapService: MapService,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStoredData();
    if (this.chacraSeleccionada?.name) {
      this.obtenerLocalidades();
    }
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private loadStoredData(): void {
    const chacraSeleccionadaString = localStorage.getItem('chacraSeleccionada');
    if (chacraSeleccionadaString) {
      this.chacraSeleccionada = JSON.parse(chacraSeleccionadaString);
    } else {
      this.chacraSeleccionada = null;
      this.toastr.info('Campo sin geolocalización. Mostrando ubicación por defecto: Posadas');
    }
    
    const idPerfilProd = localStorage.getItem('idPerfilProd');
    if (idPerfilProd) {
      this.userId = parseInt(idPerfilProd);
    }
  }

  private initializeMap(): void {
    this.map = this.mapService.initializeMap(this.mapContainer);
    if (this.chacraSeleccionada && this.chacraSeleccionada.geolocation) {
      const [lat, lon] = this.chacraSeleccionada.geolocation.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lon)) {
        this.map.setView([lat, lon], 13);
        this.setupMarker([lat, lon]);
        this.fieldHasGeolocation = true;
        this.latitud = lat;
        this.longitud = lon;
        this.cdr.detectChanges();
        return; 
      }
    }
    this.setDefaultLocation();
  }
  private setupMarker(coords: [number, number]): void {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }
    
    this.currentMarker = this.mapService.addMarker(this.map, coords);
    this.mapService.setupMarkerEvents(this.currentMarker, (lat, lng) => {
      this.latitud = lat;
      this.longitud = lng;
    });
    this.cdr.detectChanges();
  }

  obtenerLocalidades(): void {
    this.apiService.getLocationMisiones('location').subscribe(
      (localidades) => {
        this.localidades = localidades;
      },
      (error) => {
        console.error('Error al obtener las localidades', error);
      }
    );
  }

   


  public onSearch(localidad: string): void {
    if (!localidad?.trim()) return;

    this.mapService.searchLocation(localidad).subscribe(
      location => {
        if (location) {
          this.map.setView([location.lat, location.lon], 13);
          this.setupMarker([location.lat, location.lon]);
        } else {
          this.toastr.info('No se encontraron resultados en Misiones');
        }
      },
      error => this.toastr.error('Error en la búsqueda')
    );
  }

 
  public setDefaultLocation(): void {
    const [defaultLat, defaultLon] = this.mapService.getDefaultLocation();
    this.map.setView([defaultLat, defaultLon], 13);
    this.setupMarker([defaultLat, defaultLon]);
    this.latitud = defaultLat;
    this.longitud = defaultLon;
    this.cdr.detectChanges();
  }


  public onManualCoordinatesChange(): void {
    if (this.latitud !== null && this.longitud !== null) {
      if (this.mapService.isValidCoordinates(this.latitud, this.longitud)) {
        this.map.setView([this.latitud, this.longitud], 16);
        this.setupMarker([this.latitud, this.longitud]);
        this.cdr.detectChanges();
      } else {
        this.toastr.error('Coordenadas inválidas');
      }
    }
  }


  public registerField(): void {
    if (!this.userId || !this.chacraSeleccionada) {
      this.toastr.error('Datos de campo no seleccionados o inválidos.');
      return;
    }

    if (!this.currentMarker) {
      this.toastr.warning('No has seleccionado ningún lugar en el mapa.');
      return;
    }

    const position = this.currentMarker.getLatLng();
    const geolocationString = `${position.lat},${position.lng}`;

    this.apiService.updateGeolocationField(
      this.userId,
      this.chacraSeleccionada.id,
      geolocationString
    ).subscribe(
      response => {
        this.toastr.success('Geolocalización actualizada con éxito');
        this.router.navigate(['dashboard-backoffice/chacras']);
      },
      error => this.toastr.error('Error al actualizar la geolocalización')
    );
  }

 
  public volver(): void {
    window.history.back();
  }

  public cancelar(): void {
    window.history.back();
  }
}