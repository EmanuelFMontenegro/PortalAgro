import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from 'src/app/services/AuthService';
import { ApiService } from 'src/app/services/ApiService';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';

interface GeolocationData {
  latitude: number;
  longitude: number;
}
interface FieldArray {
  name: string;
  geolocation: string | null;
  dimensions?: number;
  observation?: string;
}
interface AddressData {
  address: string;
  localidad_id: string;
}

interface ContactData {
  id: number;
  movilPhone: string | null;
  telephone: string | null;
}

interface FieldData {
  id: number;
  name: string;
  dimensions: number;
  observation: string;
  geolocation: string;
  address: {
    id: number;
    address: string;
    location?: {
      id: number;
      name: string;
    };
  };
  contact: {
    id: number;
    movilPhone: string | null;
    telephone: string | null;
  };
  person_id: number;
  active: boolean;
}
interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
}

@Component({
  selector: 'app-geolocalizacion',
  templateUrl: './geolocalizacion.component.html',
  styleUrls: ['./geolocalizacion.component.sass'],
})
export class GeolocalizacionComponent implements AfterViewInit {
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades = new FormControl('');
  campoSeleccionado: any = {};
  nombreCampo: string;
  dimensionesCampo: number;
  detallesCampoVisible: boolean;
  @ViewChild('map') private mapContainer!: ElementRef;
  nombre: string = '';
  apellido: string = '';
  descripcion: string = '';
  dni: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  localidades: any[] = [];
  private map!: L.Map;
  private currentMarker?: L.Marker;
  private userId: number | null;
  public userEmail: string | null;
  private token: string | null;
  fieldsData: { list: FieldData[] } = { list: [] };
  selectedFieldId: number | undefined;
  fieldId: number | undefined;
  fields: FieldData[] = [];
  fieldHasGeolocation: boolean = false;
  canRegister: boolean = false;
  private personId: number | any;
  private misionesBoundingBox = {
    northWest: { lat: -25.5, lon: -56.5 },
    southEast: { lat: -28.5, lon: -53.5 },
  };

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.nombreCampo = '';
    this.dimensionesCampo = 0;
    this.detallesCampoVisible = false;
    this.token = this.authService.getToken();
    if (this.token) {
      const decoded: DecodedToken = jwtDecode(this.token);
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;
      this.personId = this.userId;

      if (this.userId !== null && this.personId !== null) {
        this.apiService
          .getPersonByIdOperador(this.userId, this.personId)
          .subscribe(
            (data) => {
              this.nombre = data.name;
              this.apellido = data.lastname;
              this.dni = data.dni;
              this.descriptions = data.descriptions;
              this.telephone = data.telephone;
              const localidad = this.localidades.find(
                (loc) => loc.id === data.location_id
              );
              this.locationId = localidad ? localidad.name.toString() : '';
            },
            (error) => {
              console.error(
                'Error al obtener nombre y apellido del usuario:',
                error
              );
            }
          );
      }
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }
  ngOnInit(): void {
    this.obtenerLocalidades();
    const campoSeleccionadoString = localStorage.getItem('campoSeleccionado');
    const fieldId = localStorage.getItem('fieldId');

    if (campoSeleccionadoString) {
      this.campoSeleccionado = JSON.parse(campoSeleccionadoString);
      this.searchFieldLocation(this.campoSeleccionado);
    } else {
      console.warn(
        'No se encontró información del campo seleccionado en el localStorage'
      );
    }

    if (fieldId) {
      this.fieldId = parseInt(fieldId);
      this.loadInitialGeolocation();
    }
  }

  ngAfterViewInit(): void {
    if (this.userId !== null) {
      this.initializeMap();
      this.loadInitialGeolocation();
      this.loadUserFields();
    } else {
      this.toastr.error('Usuario no autenticado', 'Error');
    }
  }

  searchFieldLocation(fieldArray: FieldArray): void {
    const geolocation = fieldArray.geolocation;

    if (!geolocation) {
      this.fieldHasGeolocation = false;
    } else {
      const [lat, lon] = geolocation.split(',').map(parseFloat);
      if (!isNaN(lat) && !isNaN(lon)) {
        this.fieldHasGeolocation = true;
      } else {
        console.error('Error en los datos de ubicación');
        this.fieldHasGeolocation = false;
      }
    }
  }

  obtenerCampoSeleccionado() {
    const campoSeleccionadoString = localStorage.getItem('campoSeleccionado');

    if (campoSeleccionadoString) {
      this.campoSeleccionado = JSON.parse(campoSeleccionadoString);
    } else {
    }
  }

  mostrarDetallesCampo(campo: any): void {
    if (campo) {
      this.nombreCampo = campo.name;
      this.dimensionesCampo = campo.dimensions;
      this.detallesCampoVisible = true;
    } else {
      console.warn('No se proporcionó un campo válido para mostrar detalles.');
    }
  }

  isGeolocationNotUpdated(geolocation: string | null): boolean {
    return !geolocation || geolocation.trim() === '';
  }
  isGeolocationUpdated(geolocation: string | null): boolean {
    return !!geolocation && geolocation.trim() !== '';
  }

  private loadUserFields(): void {
    if (this.userId !== null) {
      this.apiService.getFields(this.userId).subscribe(
        (response: any) => {
          if (
            response &&
            response.list &&
            Array.isArray(response.list) &&
            response.list.length > 0
          ) {
            this.fields = response.list[0].map((item: any) => {
              const field: FieldData = {
                id: item.id || 0,
                name: item.name || '',
                dimensions: item.dimensions || 0,
                observation: item.observation || '',
                geolocation: item.geolocation || '',
                address: {
                  id: item.address ? item.address.id || 0 : 0,
                  address: item.address ? item.address.address || '' : '',
                  location: item.address ? item.address.location || null : null,
                },
                contact: {
                  id: item.contact ? item.contact.id || 0 : 0,
                  movilPhone: item.contact
                    ? item.contact.movilPhone || null
                    : null,
                  telephone: item.contact
                    ? item.contact.telephone || null
                    : null,
                },
                person_id: item.person_id || 0,
                active: item.active || false,
              };
              return field;
            });

            const fieldsWithoutGeolocation = this.fields.filter(
              (field) => !this.isGeolocationUpdated(field.geolocation)
            );

            if (fieldsWithoutGeolocation.length > 0) {
              const firstFieldWithoutGeolocation = fieldsWithoutGeolocation[0];
              this.selectedFieldId = firstFieldWithoutGeolocation.id;
            } else {
              this.selectedFieldId = this.fields[0].id;
            }
          } else {
          }
        },
        (error) => {
          console.error('Error al cargar los campos del usuario:', error);
        }
      );
    }
  }

  private initializeMap(): void {
    const latitudInicial = -27.362137;
    const longitudInicial = -55.900875;
    const zoomInicial = 4;

    // Límites geográficos de Argentina
    const southWest = L.latLng(-55.25, -75); // Latitud mínima, Longitud mínima
    const northEast = L.latLng(-21.75, -53.5); // Latitud máxima, Longitud máxima
    const bounds = L.latLngBounds(southWest, northEast);

    // Utiliza el contenedor específico del mapa para el selector
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [latitudInicial, longitudInicial],
      zoom: zoomInicial,
      maxBounds: bounds, // Establecer límites para el mapa
      maxZoom: 18, // Limitar el zoom máximo para evitar ver más allá de Argentina
      minZoom: 5, // Limitar el zoom mínimo para mantener la visualización de Argentina
    });

    // Agrega solo la capa de relieve de Stadia Maps
    L.tileLayer(
      'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Imágenes satelitales &copy; <a href="https://www.esri.com/">Esri</a>',
      }
    ).addTo(this.map);

    this.map.on('click', this.onMapClick.bind(this));
    this.cdr.detectChanges();
  }

  cargarDatosDeUsuario() {
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;

      this.personId = this.userId;

      if (this.userId !== null && this.personId !== null) {
        this.apiService
          .getPersonByIdOperador(this.userId, this.personId)
          .subscribe(
            (data) => {
              this.nombre = data.name;
              this.apellido = data.lastname;
            },
            (error) => {
              console.error(
                'Error al obtener nombre y apellido del usuario:',
                error
              );
            }
          );
      }
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }
  obtenerLocalidades() {
    this.apiService.getLocationMisiones('location').subscribe(
      (localidades) => {
        this.localidades = localidades;
        this.filteredLocalidades = this.filtroLocalidades.valueChanges.pipe(
          startWith(''),
          map((value) => this.filtrarLocalidades(value ?? ''))
        );
      },
      (error) => {
        console.error('Error al obtener las localidades', error);
      }
    );
  }
  private filtrarLocalidades(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.localidades.filter((loc) =>
      loc.name.toLowerCase().includes(filterValue)
    );
  }

  mostrarGeolocalizacion(): void {
    let latitude: number;
    let longitude: number;

    const geolocationString = localStorage.getItem('geolocalizacion');
    if (geolocationString) {
      const geolocationData = geolocationString.split(',').map(parseFloat);
      latitude = geolocationData[0];
      longitude = geolocationData[1];
    } else if (this.fieldHasGeolocation) {
      const geolocationData = this.campoSeleccionado.geolocation
        .split(',')
        .map(parseFloat);
      latitude = geolocationData[0];
      longitude = geolocationData[1];
    } else {
      this.toastr.warning(
        'El campo no tiene información de geolocalización',
        'Advertencia'
      );
      return;
    }

    if (!this.map) {
      this.map = L.map('map').setView([latitude, longitude], 13);
      L.tileLayer(
        'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
            'Imágenes satelitales &copy; <a href="https://www.esri.com/">Esri</a>',
        }
      ).addTo(this.map);
    }

    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });

    L.marker([latitude, longitude])
      .addTo(this.map)
      .bindPopup('Ubicación del campo')
      .openPopup();
  }

  loadInitialGeolocation(): void {
    if (this.userId !== null && this.fieldId !== undefined) {
      this.apiService.getGeolocationField(this.userId, this.fieldId).subscribe(
        (response: any) => {
          if (response && response.geolocation) {
            const geoData = response.geolocation;
            if (
              geoData.latitude !== undefined &&
              geoData.longitude !== undefined
            ) {
              this.addMarker([geoData.latitude, geoData.longitude]);
              this.map.setView([geoData.latitude, geoData.longitude], 200);
            } else {
            }
          } else {
            this.toastr.info(
              'Existen Campos sin Geolocalizar, Por Favor actualizalos.',
              'Información'
            );
          }
        },
        (error) => {
          console.error('Error al cargar la geolocalización:', error);
          this.toastr.info('No cuenta con campos para actualizar.', 'Atención');
        }
      );
    }
  }

  private addMarker(coords: [number, number]): void {
    if (coords && !isNaN(coords[0]) && !isNaN(coords[1])) {
      this.currentMarker = L.marker(coords).addTo(this.map);
      this.currentMarker.bindPopup('Ubicación seleccionada').openPopup();
    } else {
      this.toastr.error(
        'Coordenadas no válidas para la geolocalización',
        'Error'
      );
    }
  }

  onSearch(localidad: string): void {
    if (localidad) {
      this.searchPlace(localidad);
    } else {
      console.error('El valor de búsqueda es nulo.');
    }
  }

  private searchPlace(query: string): void {
    const boundingBox = [
      this.misionesBoundingBox.northWest.lon,
      this.misionesBoundingBox.northWest.lat,
      this.misionesBoundingBox.southEast.lon,
      this.misionesBoundingBox.southEast.lat,
    ].join(',');

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&bounded=1&viewbox=${boundingBox}`;
    this.http.get<any[]>(url).subscribe(
      (results) => {
        if (results && results.length > 0) {
          const firstResult = results[0];
          this.map.setView([firstResult.lat, firstResult.lon], 13);
          if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
          }
          this.currentMarker = L.marker([
            firstResult.lat,
            firstResult.lon,
          ]).addTo(this.map);
          this.currentMarker
            .bindPopup(`Ubicación encontrada: ${query}`)
            .openPopup();
          this.cdr.detectChanges();
        } else {
          this.toastr.info(
            'No se encontraron resultados para la búsqueda en Misiones',
            'Info'
          );
        }
      },
      (error) => {
        this.toastr.error(
          'Error en la búsqueda de lugares en Misiones',
          'Error'
        );
      }
    );
  }
  updateGeolocation(item: FieldData): void {
    const misionesCoordinates: GeolocationData = {
      latitude: -27.3671, // Latitud de Misiones
      longitude: -55.8961, // Longitud de Misiones
    };

    const geolocationString = `${misionesCoordinates.latitude},${misionesCoordinates.longitude}`;

    this.apiService
      .updateGeolocationField(this.userId!, item.id, geolocationString)
      .subscribe(
        (response: any) => {
          this.toastr.success('Geolocalización actualizada con éxito', 'Éxito');
          item.geolocation = geolocationString;
        },
        (error: any) => {
          this.toastr.error('Error al actualizar la geolocalización', 'Error');
        }
      );
  }

  selectField(fieldName: string): void {
    const selectedField = this.fieldsData.list.find(
      (field) => field.name === fieldName
    );
    if (selectedField) {
      this.selectedFieldId = selectedField.id;
    } else {
      console.warn('Campo no encontrado:', fieldName);
    }
  }

  registerField(): void {
    if (!this.userId || !this.campoSeleccionado) {
      console.error('Datos de campo no seleccionados o inválidos.');
      return;
    }

    if (!this.currentMarker || !this.currentMarker.getLatLng()) {
      this.toastr.warning(
        'No has seleccionado ningún lugar en el mapa.',
        'Atención'
      );
      return;
    }

    const latitude = this.currentMarker.getLatLng().lat;
    const longitude = this.currentMarker.getLatLng().lng;
    const geolocationString = `${latitude},${longitude}`;

    this.apiService
      .updateGeolocationField(
        this.userId,
        this.campoSeleccionado.id,
        geolocationString
      )
      .subscribe(
        (response: any) => {
          this.toastr.success('Geolocalización actualizada con éxito', 'Éxito');
          this.router.navigate(['dashboard/inicio']);
        },
        (error: any) => {
          this.toastr.error('Error al actualizar la geolocalización', 'Error');
        }
      );
  }

  volver() {
    this.router.navigate(['dashboard/inicio']);
  }
  cancelar() {
    this.router.navigate(['dashboard/inicio']);
  }

  onMapClick(e: L.LeafletMouseEvent): void {
    if (!this.currentMarker) {
      this.currentMarker = L.marker(e.latlng).addTo(this.map);
    } else {
      this.currentMarker.setLatLng(e.latlng);
    }
  }
}
