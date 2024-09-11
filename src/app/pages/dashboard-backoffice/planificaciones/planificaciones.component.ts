import { Component, OnInit } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import { ApiService } from 'src/app/services/ApiService';
import { ServiciosService } from 'src/app/services/servicios.service';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { RESOURCE_CACHE_PROVIDER } from '@angular/platform-browser-dynamic';

interface Servicio {
  id: number; // Asegúrate de incluir un ID único para cada servicio
  field: { name: string } | null;
  location: { name: string } | null;
  typeCrop: { name: string } | null;
  status: { name: string; id: number } | null;
  statusId: number;
  statusName: string;
}
interface Location {
  lat: number;
  lng: number;
}

interface LatLngWithId {
  lat: number;
  lng: number;
  id: number;
}
interface Chacra {
  id: number;
  name: string;
  dimensions: number;
  observation: string;
  geolocation: string;
  address: {
    address: string | null;
    location: {
      id: number;
      name: string;
      department_id: number;
    };
  };
  contact: {
    id: number;
    movilPhone: string | null;
    telephone: string | null;
  };
  person_id: number;
  active: boolean;
  url_profile: string | null;
}

@Component({
  selector: 'app-planificaciones',
  templateUrl: './planificaciones.component.html',
  styleUrls: ['./planificaciones.component.sass'], // Cambiado a .scss
})
export class PlanificacionesComponent implements OnInit {
  servicios: any[] = [];
  estadosUnicos: string[] = [];
  selectedEstado: string = '';
  selectedUserIds: number[] = [];
  estados: { id: number; name: string }[] = [];
  latLngArray: LatLngWithId[] = [];
  chacras: Chacra[] = [];
  displayedColumns: string[] = [
    'nro',
    'nombre',
    'localidad',
    'cultivo',
    'estado',
  ];

  constructor(
    public dashboardBackOffice: DashboardBackOfficeService,
    private serviciosService: ServiciosService,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
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
    this.cargarServicios();
    this.cargarEstados();
    this.obtenerGeoDeUser();
    this.actualizarServiciosSolicitados();
  }

  cargarEstados(): void {
    this.serviciosService.getAllStatus().subscribe(
      (response) => {
        console.log('respuesta de estados', response);

        if (response && response.list && Array.isArray(response.list)) {
          this.estados = response.list[0].map((status: any) => ({
            id: status.id,
            name: status.name,
          }));

          this.estadosUnicos = this.estados.map((status) => status.name);

          console.log('Estados únicos:', this.estadosUnicos);
        } else {
          console.error('La estructura de la respuesta no es la esperada.');
        }
      },
      (error) => {
        console.error('Error al cargar los estados:', error);
      }
    );
  }

  cargarServicios(): void {
    this.serviciosService.getServicios().subscribe(
      (response) => {
        console.log('Respuesta de la API:', response);

        if (response && response.list && Array.isArray(response.list[0])) {
          // Eliminar duplicados basados en el ID del servicio
          const uniqueServices = new Map<number, any>();

          response.list[0].forEach((servicio: any) => {
            if (!uniqueServices.has(servicio.id)) {
              uniqueServices.set(servicio.id, servicio);
            }
          });

          this.servicios = Array.from(uniqueServices.values()).map(
            (servicio: any, index: number) => {
              const estado = this.estados.find(e => e.name === servicio.status.name);
              const estadoId = estado ? estado.id : null;
              const estadoName = estado ? estado.name : 'No definido';

              return {
                id: servicio.id,
                nro: index + 1,
                nombre: servicio.field ? servicio.field.name : 'No definido',
                localidad: servicio.location ? servicio.location.name : 'No definido',
                cultivo: servicio.typeCrop ? servicio.typeCrop.name : 'No definido',
                estado: servicio.status ? servicio.status.name : 'No definido',
                statusId: estadoId,
                statusName: estadoName,
              };
            }
          );

          console.log('Servicios mapeados:', this.servicios);
        } else {
          console.error('Error: La respuesta no contiene una lista válida de servicios.');
        }
      },
      (error) => {
        console.error('Error al cargar los servicios:', error);
      }
    );
  }


  actualizarServiciosSolicitados(): void {
    const serviciosSolicitados = this.servicios.filter(
      (servicio) => servicio.estado === 'SOLICITADA'
    );

    serviciosSolicitados.forEach((servicio) => {
      if (servicio.serviceId) {
        // Asegúrate de que serviceId esté definido
        const body = { estado: 'pendiente' };
        this.serviciosService
          .putAprovedService(body, servicio.serviceId)
          .subscribe(
            (response) => {
              console.log(
                `Servicio ${servicio.serviceId} actualizado a pendiente.`
              );
              // Actualizar el estado del servicio en la lista local
              const index = this.servicios.findIndex(
                (s) => s.serviceId === servicio.serviceId
              );
              if (index !== -1) {
                this.servicios[index].estado = 'pendiente';
              }
            },
            (error) => {
              console.error(
                `Error al actualizar el servicio ${servicio.serviceId}:`,
                error
              );
            }
          );
      } else {
        console.error('serviceId no está definido para el servicio', servicio);
      }
    });
  }

  cambiarEstado(servicio: any): void {
    if (servicio.estado === 'SOLICITADA' && servicio.statusId) {
      const nuevoEstadoId = 2; // Asegúrate de que este sea el ID correcto para "PENDIENTE"
      const body = { estado: nuevoEstadoId };

      console.log('Cambiando estado del servicio:', servicio.id, body);

      this.serviciosService.putAprovedService(body, servicio.id).subscribe(
        (response) => {
          console.log(
            `Servicio ${servicio.id} actualizado a PENDIENTE en el backend.`
          );

          const index = this.servicios.findIndex((s) => s.id === servicio.id);
          if (index !== -1) {
            this.servicios[index].estado = 'PENDIENTE';
          }
          this.toastr.success(
            'El estado del servicio ha sido actualizado.',
            'Actualización Exitosa'
          );
        },
        (error) => {
          console.error(
            `Error al actualizar el servicio ${servicio.id}:`,
            error
          );
          this.toastr.error(
            'Error al actualizar el estado del servicio.',
            'Error'
          );
        }
      );
    } else {
      console.error(
        'No se puede cambiar el estado. Verifica el estado y serviceId.',
        servicio
      );
    }
  }
  private dmsToDecimal(degrees: number, minutes: number, seconds: number): number {
    return degrees + minutes / 60 + seconds / 3600;
  }

  // Método para convertir una cadena DMS a decimal
  private convertDmsToDecimal(dms: string): number | null {
    const match = dms.match(/^(\d+)°(\d+)'(\d+)''$/);
    if (match) {
      const [_, degrees, minutes, seconds] = match.map(Number);
      return this.dmsToDecimal(degrees, minutes, seconds);
    }
    return null;
  }
  obtenerGeoDeUser(): void {
    this.apiService.getUsersFields(0, 1000, 'id', 'asc').subscribe(
      (response: any) => {
        console.log('Datos de geolocalización USER', response);
        if (response && response.list) {
          this.chacras = response.list[0].filter((chacra: Chacra) => chacra.geolocation);

          this.latLngArray = [];

          this.chacras.forEach((chacra: Chacra) => {
            let [lat, lng] = this.parseGeolocation(chacra.geolocation);

            // Si la geolocalización es incorrecta, intenta con el formato alternativo
            if (lat === null || lng === null) {
              const geoParts = chacra.geolocation.split(' - ');
              if (geoParts.length === 2) {
                const latParts = geoParts[0].split('°');
                const lngParts = geoParts[1].split('°');
                const latDecimal = this.convertDmsToDecimal(`${latParts[0]}°${latParts[1]}'${latParts[2]}''`);
                const lngDecimal = this.convertDmsToDecimal(`${lngParts[0]}°${lngParts[1]}'${lngParts[2]}''`);
                lat = latDecimal;
                lng = lngDecimal;
              }
            }

            if (lat !== null && lng !== null) {
              const marker = L.marker([lat, lng]).addTo(this.map!);
              marker.bindPopup(`Chacra: ${chacra.name}`);

              const servicio = this.servicios.find((s) => s.id === chacra.id);
              if (servicio) {
                servicio.location = { lat, lng, name: chacra.name };
              }

              this.latLngArray.push({ lat, lng, id: chacra.id });
              console.log(`Agregado al array latLngArray: id=${chacra.id}, lat=${lat}, lng=${lng}`);
            } else {
              console.error(`Coordenadas inválidas para chacra ${chacra.id}: ${chacra.geolocation}`);
            }
          });

          if (this.latLngArray.length > 0) {
            const bounds = L.latLngBounds(this.latLngArray.map((coords) => L.latLng(coords.lat, coords.lng)));
            this.map?.fitBounds(bounds);
          }
        }
      },
      (error) => {
        console.error('Error al obtener las geolocalizaciones:', error);
        this.toastr.error('No se pudieron cargar las ubicaciones de las chacras', 'Error');
      }
    );
  }




  parseGeolocation(geolocation: string): [number | null, number | null] {
    if (!geolocation) return [null, null];
    const parts = geolocation.split(',');
    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      return [isNaN(lat) ? null : lat, isNaN(lng) ? null : lng];
    }
    return [null, null];
  }

  seleccionarChacra(event: MatCheckboxChange, servicio: Servicio): void {
    console.log('Seleccionando chacra:', servicio.id);
    if (
      servicio.location &&
      typeof servicio.location === 'object' &&
      'lat' in servicio.location &&
      'lng' in servicio.location
    ) {
      try {
        const { lat, lng } = servicio.location as Location;
        if (event.checked) {
          // Agregar la ubicación al array si el checkbox está marcado
          if (!this.latLngArray.some((coords) => coords.id === servicio.id)) {
            this.latLngArray.push({ lat, lng, id: servicio.id });
            console.log(
              `Ubicación agregada: id=${servicio.id}, lat=${lat}, lng=${lng}`
            );
          }
        } else {
          // Eliminar la ubicación del array si el checkbox está desmarcado
          this.latLngArray = this.latLngArray.filter(
            (coords) => coords.id !== servicio.id
          );
          console.log(`Ubicación eliminada: id=${servicio.id}`);
        }
      } catch (error) {
        console.error('Error al acceder a las coordenadas:', error);
      }
    } else {
      console.warn(
        'Este servicio no tiene una ubicación asociada válida.',
        servicio
      );
      this.toastr.warning(
        'Este servicio no tiene una ubicación asociada válida.',
        'Aviso'
      );
    }
  }

  initMap(): void {
    this.map = L.map('map').setView([0, 0], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  crearRuta(): void {
    if (this.latLngArray.length > 1) {
      const waypoints = this.latLngArray.map((coords) => {
        console.log(`Waypoint: lat=${coords.lat}, lng=${coords.lng}`);
        return L.latLng(coords.lat, coords.lng);
      });

      (L as any).Routing.control({
        waypoints: waypoints,
        routeWhileDragging: true,
        geocoder: (L as any).Control.Geocoder.nominatim(),
      }).addTo(this.map);

      if (this.map) {
        const bounds = L.latLngBounds(waypoints);
        this.map.fitBounds(bounds);
      }
    } else {
      this.toastr.warning(
        'Selecciona al menos dos chacras para crear una ruta.',
        'Aviso'
      );
    }
  }
}
