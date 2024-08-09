import { Component, OnInit } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';  // Asegúrate de que esta librería esté instalada

@Component({
  selector: 'app-planificaciones',
  templateUrl: './planificaciones.component.html',
  styleUrls: ['./planificaciones.component.sass'],  // Cambiado a .scss
})
export class PlanificacionesComponent implements OnInit {
  constructor(public dashboardBackOffice: DashboardBackOfficeService) {
    this.dashboardBackOffice.dataTitulo.next({
      titulo: `Planificaciones`,
      subTitulo: '',
    });
  }

  latStart: number = 0;
  lngStart: number = 0;
  latEnd: number = 0;
  lngEnd: number = 0;
  map: L.Map | undefined;

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([0, 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  loadRoute(): void {
    if (this.latStart && this.lngStart && this.latEnd && this.lngEnd) {
      const start = L.latLng(this.latStart, this.lngStart);
      const end = L.latLng(this.latEnd, this.lngEnd);

      (L as any).Routing.control({
        waypoints: [start, end],
        routeWhileDragging: true,
        geocoder: (L as any).Control.Geocoder.nominatim()  // Asegúrate de que el geocoder esté disponible
      }).addTo(this.map);

      if (this.map) {
        const bounds = L.latLngBounds([start, end]);  // Crear LatLngBounds
        this.map.fitBounds(bounds);  // Ajustar el mapa a los límites
      }
    } else {
      alert('Please provide both start and end coordinates.');
    }
  }
}
