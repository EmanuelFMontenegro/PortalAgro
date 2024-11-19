// map.service.ts
import { Injectable, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly DEFAULT_COORDINATES = {
    lat: -27.36708,
    lon: -55.89608,
    zoom: 13,
    description: 'Posadas, Misiones'
  };

  private misionesBoundingBox = {
    northWest: { lat: -25.5, lon: -56.5 },
    southEast: { lat: -28.5, lon: -53.5 },
  };

  constructor(private http: HttpClient) {}
getDefaultLocation(): [number, number] {
    return [this.DEFAULT_COORDINATES.lat, this.DEFAULT_COORDINATES.lon];
  }
 
  initializeMap(mapContainer: ElementRef): L.Map {
    const map = L.map(mapContainer.nativeElement).setView([0, 0], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    return map;
  }

  addMarker(map: L.Map, coords: [number, number], isDraggable = true): L.Marker {
    return L.marker(coords, { draggable: isDraggable }).addTo(map);
  }

  loadStoredLocation(key: string = 'chacraSeleccionada'): { lat: number, lon: number } | null {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data.geolocation) {
        const [lat, lon] = data.geolocation.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lon)) {
          return { lat, lon };
        }
      }
    }
    return null;
  }

  getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocalización no soportada');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }

  searchLocation(query: string): Observable<{lat: number, lon: number} | null> {
    const boundingBox = [
      this.misionesBoundingBox.northWest.lon,
      this.misionesBoundingBox.northWest.lat,
      this.misionesBoundingBox.southEast.lon,
      this.misionesBoundingBox.southEast.lat,
    ].join(',');

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&bounded=1&viewbox=${boundingBox}`;

    return this.http.get<any[]>(url).pipe(
      map(results => {
        if (results && results.length > 0) {
          return {
            lat: parseFloat(results[0].lat),
            lon: parseFloat(results[0].lon)
          };
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  isValidCoordinates(lat: number, lon: number): boolean {
    return !isNaN(lat) && !isNaN(lon) &&
           lat >= -90 && lat <= 90 &&
           lon >= -180 && lon <= 180;
  }

  setupMarkerEvents(marker: L.Marker, onDrag: (lat: number, lng: number) => void) {
    marker.on('drag dragend', (event: L.LeafletEvent) => {
      const position = (event.target as L.Marker).getLatLng();
      onDrag(position.lat, position.lng);
    });
  }
}