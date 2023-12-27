import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from 'src/app/services/AuthService';
import { ApiService } from 'src/app/services/ApiService';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';

interface GeolocationData {
  latitude: number;
  longitude: number;
}

interface DecodedToken {
  emailId: string;
  userId: number;
  // Añade aquí otros campos que puedan estar presentes en el token
}

@Component({
  selector: 'app-geolocalizacion',
  templateUrl: './geolocalizacion.component.html',
  styleUrls: ['./geolocalizacion.component.sass']
})
export class GeolocalizacionComponent implements AfterViewInit {
  @ViewChild('map') private mapContainer!: ElementRef;
  private map!: L.Map;
  private currentMarker?: L.Marker;
  private userId: number | null;
  public userEmail: string | null;
  private token: string | null;

  private misionesBoundingBox = {
    northWest: { lat: -25.5, lon: -56.5 },
    southEast: { lat: -28.5, lon: -53.5 }
  };

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.token = this.authService.getToken();
    if (this.token) {
      const decoded: DecodedToken = jwtDecode(this.token);
      this.userId = decoded.userId;
      this.userEmail = decoded.emailId;
      console.log('este es mail',this.userEmail)
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }

  ngAfterViewInit(): void {
    if (this.userId !== null) {
      console.log('este es userID',this.userId)
      this.initializeMap();
      this.loadInitialGeolocation();
    } else {
      this.toastr.error('Usuario no autenticado', 'Error');
    }
  }

  private initializeMap(): void {
    const latitudInicial = -27.362137;
    const longitudInicial = -55.900875;
    const zoomInicial = 13;

    this.map = L.map(this.mapContainer.nativeElement).setView([latitudInicial, longitudInicial], zoomInicial);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', this.onMapClick.bind(this));
    this.cdr.detectChanges();
  }

  private loadInitialGeolocation(): void {
    if (this.userId !== null) {
      this.apiService.getGeolocationField(this.userId, 1)
        .subscribe((response: any) => {
          if (response && response.geolocation) {
            const geoData = response.geolocation;
            if (geoData.latitude !== undefined && geoData.longitude !== undefined) {
              this.addMarker([geoData.latitude, geoData.longitude]);
              this.map.setView([geoData.latitude, geoData.longitude], 13);
            } else {
              this.toastr.info('Cargando datos de geolocalización.', 'Información');
            }
          } else {
            this.toastr.info('Datos de geolocalización no disponibles.', 'Información');
          }
        }, error => {
          this.toastr.error('Error al cargar la geolocalización.', 'Error');
        });
    }
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
      this.currentMarker = undefined;
    } else {
      this.addMarker([e.latlng.lat, e.latlng.lng]);
    }
  }

  private addMarker(coords: [number, number]): void {

    if (coords && coords[0] !== undefined && coords[1] !== undefined) {
      this.currentMarker = L.marker(coords).addTo(this.map);
      this.currentMarker.bindPopup('Ubicación seleccionada').openPopup();
    } else {
      console.error('Coordenadas no válidas:', coords);
      this.toastr.error('Coordenadas no válidas para la geolocalización', 'Error');
    }
  }

  onSearch(): void {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const query = searchInput.value;
    this.searchPlace(query);
  }

  private searchPlace(query: string): void {
    const boundingBox = [this.misionesBoundingBox.northWest.lon, this.misionesBoundingBox.northWest.lat,
                         this.misionesBoundingBox.southEast.lon, this.misionesBoundingBox.southEast.lat].join(',');

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&bounded=1&viewbox=${boundingBox}`;
    this.http.get<any[]>(url).subscribe(results => {
      if (results && results.length > 0) {
        const firstResult = results[0];
        this.map.setView([firstResult.lat, firstResult.lon], 13);
        if (this.currentMarker) {
          this.map.removeLayer(this.currentMarker);
        }
        this.currentMarker = L.marker([firstResult.lat, firstResult.lon]).addTo(this.map);
        this.currentMarker.bindPopup(`Ubicación encontrada: ${query}`).openPopup();
        this.cdr.detectChanges();
      } else {
        this.toastr.info('No se encontraron resultados para la búsqueda en Misiones', 'Info');
      }
    }, error => {
      this.toastr.error('Error en la búsqueda de lugares en Misiones', 'Error');
    });
  }

  registerField(): void {
    if (this.currentMarker && this.userId !== null) {
      console.log('el user es',this.userId)
      const markerLatLng = this.currentMarker.getLatLng();
      const geolocationString = `${markerLatLng.lat},${markerLatLng.lng}`;
      this.apiService.updateGeolocationField(this.userId, 1, geolocationString)
        .subscribe(response => {
          this.toastr.success('Geolocalización actualizada con éxito', 'Éxito');
        }, error => {
          this.toastr.error('Error al actualizar la geolocalización', 'Error');
        });
    } else {
      this.toastr.info('No hay marcador seleccionado para actualizar', 'Info');
    }
  }
}
