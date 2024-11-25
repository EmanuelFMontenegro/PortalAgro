import { Component, OnInit } from '@angular/core';
import { TravelService } from './travelService.service';
import { ToastrService } from 'ngx-toastr';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

interface Servicio {
  nro: number;
  id: number;
  productor: string;
  localidad: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-planificaciones',
  templateUrl: './planificaciones.component.html',
  styleUrls: ['./planificaciones.component.sass'],
})
export class PlanificacionesComponent implements OnInit {
  servicios: Servicio[] = [];
  serviciosSeleccionados: Servicio[] = [];
  map: L.Map | undefined;
  routingControl: L.Routing.Control | undefined;
  ubicacionActual: { lat: number; lng: number } | undefined;

  constructor(
    private travelService: TravelService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.obtenerUbicacionActual();
    this.cargarServicios();
  }

  // Inicializar el mapa con un zoom adecuado
  initMap(): void {
    this.map = L.map('map').setView([-27.4697707, -55.8239036], 13); // Ubicación inicial en Misiones
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  // Obtener la ubicación actual
  obtenerUbicacionActual(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ubicacionActual = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          L.marker([this.ubicacionActual.lat, this.ubicacionActual.lng])
            .addTo(this.map!)
            .bindPopup('<b>Ubicación Actual</b>')
            .openPopup();
        },
        () => {
          this.toastr.error('No se pudo obtener la ubicación actual.', 'Error');
        }
      );
    } else {
      this.toastr.warning(
        'La geolocalización no está soportada en este navegador.',
        'Aviso'
      );
    }
  }

  // Cargar servicios
  cargarServicios(): void {
    this.travelService.getServicesForTravel('id', 'DESC', 10, 0).subscribe(
      (response) => {
        if (response?.list?.[0]) {
          this.servicios = response.list[0].map(
            (servicio: any, index: number) => ({
              nro: index + 1,
              id: servicio.id,
              productor: servicio.producer
                ? `${servicio.producer.name} ${servicio.producer.lastname}`
                : 'No definido',
              localidad: servicio.location?.name || 'No definido',
              lat: servicio.field?.geolocation
                ? parseFloat(servicio.field.geolocation.split(',')[0])
                : 0,
              lng: servicio.field?.geolocation
                ? parseFloat(servicio.field.geolocation.split(',')[1])
                : 0,
            })
          );
        }
      },
      () => {
        this.toastr.error('Error al cargar los servicios', 'Error');
      }
    );
  }

  // Seleccionar un servicio
  seleccionarServicio(event: any, servicio: Servicio): void {
    if (event.checked) {
      this.serviciosSeleccionados.push(servicio);
    } else {
      this.serviciosSeleccionados = this.serviciosSeleccionados.filter(
        (s) => s.id !== servicio.id
      );
    }
  }

  // Crear ruta con Leaflet Routing Machine
  crearRuta(): void {
    if (!this.ubicacionActual) {
      this.toastr.error('No se pudo obtener la ubicación actual.', 'Error');
      return;
    }

    if (this.serviciosSeleccionados.length < 1) {
      this.toastr.warning(
        'Debe seleccionar al menos un servicio para crear una ruta.',
        'Aviso'
      );
      return;
    }

    const waypoints = [
      L.latLng(this.ubicacionActual.lat, this.ubicacionActual.lng),
      ...this.serviciosSeleccionados.map((s) => L.latLng(s.lat, s.lng)),
    ];

    // Eliminar control de enrutamiento previo
    if (this.routingControl) {
      this.map?.removeControl(this.routingControl);
    }

    // Crear nueva ruta con Leaflet Routing Machine
    this.routingControl = L.Routing.control({
      waypoints: waypoints,
      router: new L.Routing.OSRMv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
      }),
      routeWhileDragging: true,
      show: false, // No mostrar el panel de itinerario
      lineOptions: {
        styles: [{ color: 'blue', weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
    }).addTo(this.map!);

    // Mostrar distancia total
    this.routingControl.on('routesfound', (e: any) => {
      const distance = e.routes[0].summary.totalDistance / 1000; // Convertir metros a kilómetros
      this.toastr.success(
        `Distancia total: ${distance.toFixed(2)} km.`,
        'Ruta creada'
      );
    });
  }
}
