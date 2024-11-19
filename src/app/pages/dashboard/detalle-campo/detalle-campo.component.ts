import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/ApiService';
import { MapService } from 'src/app/services/map.service';
import * as L from 'leaflet';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

interface FieldDetails {
  id: number;
  name: string;
  dimensions: number;
  observation: string;
  geolocation: string | null;
  address: {
    id: number;
    address: string;
    location: {
      id: number;
      name: string;
    };
  };
}

@Component({
  selector: 'app-detalle-campo',
  templateUrl: './detalle-campo.component.html',
  styleUrls: ['./detalle-campo.component.scss']
})
export class DetalleCampoComponent implements OnInit, AfterViewInit {
  @ViewChild('map') private mapContainer!: ElementRef;
  private map!: L.Map;
  public currentMarker?: L.Marker;

  public latitud: number | null = null;
  public longitud: number | null = null;
  public opcionGeolocalizacion: string = '';
  public showManualCoordinatesInput: boolean = false;

  public filteredLocalidades: Observable<any[]> | null = null;
  public filtroLocalidades = new FormControl('');
  public localidades: any[] = [];
  public campoSeleccionado: any = {};
  public fieldHasGeolocation: boolean = false;
  public userId: number | null = null;

  constructor(
    private mapService: MapService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStoredData();
    if (this.campoSeleccionado?.name) {
    }
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private loadStoredData(): void {
    const campoSeleccionadoString = localStorage.getItem('campoSeleccionado');
    if (campoSeleccionadoString) {
      try {
        this.campoSeleccionado = JSON.parse(campoSeleccionadoString);
        if (this.campoSeleccionado.geolocation) {
          this.toastr.success('Campo geolocalizado correctamente');
        } else {
          this.toastr.info('Campo sin geolocalización. Mostrando ubicación por defecto: Posadas');
        }
      } catch (error) {
        this.campoSeleccionado = null;
        this.toastr.warning('Error al cargar el campo, usando ubicación por defecto');
      }
    } else {
      this.campoSeleccionado = null;
      this.toastr.info('Mostrando ubicación por defecto: Posadas');
    }
  }

  private initializeMap(): void {
    try {
      this.map = this.mapService.initializeMap(this.mapContainer);
      
      if (this.campoSeleccionado?.geolocation) {
        const [lat, lon] = this.campoSeleccionado.geolocation.split(',').map(Number);
        
        if (this.mapService.isValidCoordinates(lat, lon)) {
          this.map.setView([lat, lon], 13);
          this.setupMarker([lat, lon]);
          this.fieldHasGeolocation = true;
          this.latitud = lat;
          this.longitud = lon;
        } else {
          console.warn('Coordenadas inválidas en el campo:', { lat, lon });
          this.setupDefaultLocation();
        }
      } else {
        this.setupDefaultLocation();
      }
  
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
      this.toastr.error('Error al cargar el mapa');
    }
  }

  private setupDefaultLocation(): void {
    const [defaultLat, defaultLon] = this.mapService.getDefaultLocation();
    this.map.setView([defaultLat, defaultLon], 13);
    this.setupMarker([defaultLat, defaultLon]);
    this.fieldHasGeolocation = false;
    this.latitud = defaultLat;
    this.longitud = defaultLon;
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


  public geolocalizar(): void {
    this.router.navigate(['/dashboard/geolocalizacion']);
  }

  public volver(): void {
    this.router.navigate(['dashboard/chacras']);
  }
}