import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-geolocalizacion',
  templateUrl: './geolocalizacion.component.html',
  styleUrls: ['./geolocalizacion.component.sass']
})
export class GeolocalizacionComponent implements AfterViewInit {
  @ViewChild('map') private mapContainer!: ElementRef;
  private map!: L.Map;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    const latitudInicial = -27.362137; // Ejemplo: Latitud de Misiones, Argentina
    const longitudInicial = -55.900875; // Ejemplo: Longitud de Misiones, Argentina
    const zoomInicial = 13;

    this.map = L.map(this.mapContainer.nativeElement).setView([latitudInicial, longitudInicial], zoomInicial);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  onSearch(): void {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const query = searchInput.value;
    this.searchPlace(query);
  }

  private searchPlace(query: string): void {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    this.http.get<any[]>(url).subscribe(results => {
      if (results && results.length > 0) {
        const firstResult = results[0];
        this.map.setView([firstResult.lat, firstResult.lon], 13);
      } else {
        // Manejar "sin resultados"
        console.log('No se encontraron resultados');
      }
    }, error => {
      // Manejar errores de la solicitud
      console.error('Error en la búsqueda:', error);
    });
  }
}
