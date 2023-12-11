import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.sass']
})
export class InicioComponent implements AfterViewInit {
  searchControl = new FormControl('');
  mapa!: L.Map;
  private mapaInicializado = false; // Flag para evitar reinicialización

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.setupSearch();
  }

  cambiarEstadoServicio(servicio: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const estado = checkbox.checked;
    // Aquí puedes agregar la lógica para manejar el cambio de estado del servicio
    console.log(`Servicio: ${servicio}, Estado: ${estado}`);
  }
  onTabChange(event: MatTabChangeEvent): void {
    // Reemplaza 2 con el índice real de la pestaña que contiene el mapa
    if (event.index === 2 && !this.mapaInicializado) {
      this.mapaInicializado = true; // Marca el mapa como inicializado
      this.inicializarMapa();
    }
  }

  inicializarMapa(): void {
    var latitud_inicial = -34.6037; // Latitud de Buenos Aires
    var longitud_inicial = -58.3816; // Longitud de Buenos Aires
    var nivel_de_zoom = 13;

    this.mapa = L.map('mapa').setView([latitud_inicial, longitud_inicial], nivel_de_zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.mapa);
  }

  setupSearch(): void {
    this.searchControl.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        this.searchAddress(value);
      }
    });
  }

  searchAddress(query: string): void {
    if (!query.trim()) return;

    const url = `https://YOUR_CORS_PROXY/http://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    this.http.get<any[]>(url).subscribe(results => {
      if (results && results.length > 0) {
        const { lat, lon } = results[0];
        this.mapa.setView(new L.LatLng(lat, lon), 13);
      }
    });
  }
}
