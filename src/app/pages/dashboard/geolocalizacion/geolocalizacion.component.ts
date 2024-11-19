import { Component, ViewChild, ElementRef, AfterViewInit,ChangeDetectorRef  } from '@angular/core';
import * as L from 'leaflet';
import { ApiService } from 'src/app/services/ApiService';
import { MapService } from 'src/app/services/map.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-geolocalizacion',
  templateUrl: './geolocalizacion.component.html'
})
export class GeolocalizacionComponent implements AfterViewInit {
  @ViewChild('map') private mapContainer!: ElementRef;
  private map!: L.Map;
  public currentMarker?: L.Marker;
  public ChacraLatLng: [number, number] = [0,0];
  public latitud: number | null = null;
  public longitud: number | null = null;
  public opcionGeolocalizacion: string = 'localidad';
  public showManualCoordinatesInput: boolean = false;
  public filtroLocalidades = new FormControl('');
  public localidades: any[] = [];
  public campoSeleccionado: any = {};
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
    if (this.campoSeleccionado?.name) {
      this.obtenerLocalidades();
    }
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private loadStoredData(): void {
    const campoSeleccionadoString = localStorage.getItem('campoSeleccionado');
    if (campoSeleccionadoString) {
      this.campoSeleccionado = JSON.parse(campoSeleccionadoString); 
    } else {
      this.campoSeleccionado = null;
      this.toastr.info('Campo sin geolocalización. Mostrando ubicación por defecto: Posadas');
    }
    
    const idPerfilProd = localStorage.getItem('idPerfilProd');
    if (idPerfilProd) {
      this.userId = parseInt(idPerfilProd);
    }
  }
  public volver(): void {
    window.history.back();
  }
  private initializeMap(): void {
    this.map = this.mapService.initializeMap(this.mapContainer);
    if (this.campoSeleccionado && this.campoSeleccionado.geolocation) {
      const [lat, lon] = this.campoSeleccionado.geolocation.split(',').map(Number);
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

  private async loadCurrentLocation(): Promise<void> {
    try {
      const position = await this.mapService.getCurrentLocation();
      const { latitude: lat, longitude: lon } = position.coords;
      const accuracy = position.coords.accuracy;
  
      let zoomLevel = 14;
      if (accuracy < 50) {
        zoomLevel = 18;
      } else if (accuracy < 100) {
        zoomLevel = 16;
      }
      this.toastr.success('Ubicación actual obtenida correctamente');
      this.map.setView([lat, lon], zoomLevel);
      this.setupMarker([lat, lon]);
      this.latitud = lat;
      this.longitud = lon; 
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al obtener la geolocalización:', error);
      this.toastr.warning(
        'No se pudo obtener la ubicación actual. Revisar permisos del navegador'
      );
     this.setDefaultLocation();
    }
  }

  public onSearch(localidad: string): void {
    if (!localidad?.trim()) {
      console.error('El valor de búsqueda es nulo.');
      return;
    }

    this.mapService.searchLocation(localidad).subscribe(
      location => {
        if (location) {
          this.map.setView([location.lat, location.lon], 13);
          this.setupMarker([location.lat, location.lon]);
          this.cdr.detectChanges();
        } else {
          this.toastr.info('No se encontraron resultados para la búsqueda en Misiones');
        }
      },
      error => {
        this.toastr.error('Error en la búsqueda de lugares en Misiones');
      }
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
    if (!this.userId || !this.campoSeleccionado) {
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
      this.campoSeleccionado.id,
      geolocationString
    ).subscribe(
      response => {
        this.toastr.success('Geolocalización actualizada con éxito');
        this.router.navigate(['dashboard/chacras']);
      },
      error => {
        this.toastr.error('Error al actualizar la geolocalización');
      }
    );
  }

  async  toggleGeolocalizacion(value: string) {
    this.opcionGeolocalizacion = value;
    if (value === 'manual') {
      this.loadCurrentLocation();
    }
  }

  public cancelar(): void {
    this.router.navigate(['dashboard/chacras']);
  }
}