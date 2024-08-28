import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  ViewEncapsulation,
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
import { MatSelectChange } from '@angular/material/select';

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

interface DatosUsuario {
  accept_license: boolean;
  account_active: boolean;
  canEdit: boolean | null;
  descriptions: string;
  dni: string;
  id: number;
  lastname: string;
  location: { id: number; name: string; department_id: number };
  name: string;
  telephone: string;
  username: string;
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
  selector: 'app-chacras-geolocalizar',
  templateUrl: './chacras-geolocalizar.component.html',
  styleUrls: ['./chacras-geolocalizar.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class ChacrasGeolocalizarComponent implements AfterViewInit {
  manualCoordinates: { latitude: number; longitude: number } | null = null;
  showManualCoordinatesInput: boolean = false;
  opcionGeolocalizacion: string = '';
  latitud: number | null = null;
  longitud: number | null = null;
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades = new FormControl('');
  chacraSeleccionada: any = {};
  idPerfilProd: number | null = null;
  nombreCampo: string;
  dimensionesCampo: number;
  detallesCampoVisible: boolean;
  @ViewChild('map') private mapContainer!: ElementRef;
  nombre: string = '';
  apellido: string = '';
  email: string | null = null;
  contacto: string | null = null;
  descripcion: string = '';
  dni: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  localidades: any[] = [];
  private map!: L.Map;
  private currentMarker?: L.Marker;
  public userId: number | null;
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
          .getPersonByIdProductor(this.userId, this.personId)
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
    const perfilDataChacra = localStorage.getItem('idPerfilProd');
    if (perfilDataChacra) {
      const userId = parseInt(perfilDataChacra);
      this.personId = userId;
      this.DatosUser(userId, this.personId);
    }
    this.obtenerLocalidades();
    const chacraSeleccionadaString = localStorage.getItem('chacraSeleccionada');
    const fieldId = localStorage.getItem('fieldId');
    const idPerfilProd = localStorage.getItem('idPerfilProd');

    if (chacraSeleccionadaString) {
      this.chacraSeleccionada = JSON.parse(chacraSeleccionadaString);
      this.searchFieldLocation(this.chacraSeleccionada);
    } else {
      console.warn(
        'No se encontró información del campo seleccionado en el localStorage'
      );
    }

    if (fieldId) {
      this.fieldId = parseInt(fieldId);
      this.loadInitialGeolocation();
    }

    if (idPerfilProd) {
      this.userId = parseInt(idPerfilProd); // Asignar el valor de idPerfilProd a userId
      this.registerField(this.userId); // Llamar a registerField solo si userId tiene un valor válido
    } else {
      console.error('idPerfilProd no está disponible en el localStorage');
    }
  }
  ngAfterViewInit(): void {
    if (this.userId !== null) {
      this.initializeMap();
      this.loadInitialGeolocation();
      this.loadUserFields();

      // Verifica si el marcador es arrastrable
      if (this.currentMarker) {
        console.log('Marcador actual:', this.currentMarker);
        this.currentMarker.on('dragend', (event: L.DragEndEvent) => {
          const position = event.target.getLatLng();
          console.log('Evento dragend:', position); // Verifica si el evento se dispara correctamente
        });
      }
    } else {
      this.toastr.error('Usuario no autenticado', 'Error');
    }
  }

  updateManualCoordinates(latitude: number, longitude: number): void {
    if (isNaN(latitude) || isNaN(longitude)) {
      this.toastr.error(
        'Las coordenadas proporcionadas no son válidas.',
        'Error'
      );
      return;
    }

    this.manualCoordinates = { latitude, longitude };
    this.map.setView([latitude, longitude], 13);
    this.addMarker([latitude, longitude]);
  }

  onManualCoordinatesChange(): void {
    if (this.latitud !== null && this.longitud !== null) {
      this.updateManualCoordinates(this.latitud, this.longitud);
    }
  }

  searchByCoordinates(): void {
    if (this.latitud && this.longitud && this.map) {
      this.map.setView([this.latitud, this.longitud], 16);
      this.addMarker([this.latitud, this.longitud]);
    }
  }

  toggleManualCoordinates(value: string): void {
    console.log('Selected value:', value);
    this.opcionGeolocalizacion = value;
    this.showManualCoordinatesInput = value === 'manual';
  }

  setOpcionGeolocalizacion(opcion: string): void {
    this.opcionGeolocalizacion = opcion;
    this.showManualCoordinatesInput = opcion === 'manual';
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

  obtenerchacraSeleccionada() {
    const chacraSeleccionadaString = localStorage.getItem('chacraSeleccionada');

    if (chacraSeleccionadaString) {
      this.chacraSeleccionada = JSON.parse(chacraSeleccionadaString);
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
    if (this.mapContainer) {
      this.map = L.map(this.mapContainer.nativeElement).setView(
        [0, 0], // Coordenadas iniciales, se actualizarán más tarde
        13 // Zoom inicial
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
    }
  }

  DatosUser(userId: number, personId: number) {
    this.personId = userId;

    this.apiService.getPersonByIdProductor(userId, personId).subscribe(
      (response: DatosUsuario) => {
        if (response) {
          this.nombre = response.name;
          this.apellido = response.lastname;
          this.email = response.username;
          this.contacto = response.telephone;
        } else {
          console.warn(
            'No se encontraron datos de la persona en la respuesta:',
            response
          );
        }
      },
      (error) => {
        console.error('Error al obtener los datos de la persona:', error);
      }
    );
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
      const geolocationData = this.chacraSeleccionada.geolocation
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

  private loadInitialGeolocation(): void {
    if (navigator.geolocation) {
      this.toastr.info('Obteniendo tu ubicación actual...');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          this.toastr.success(
            `Ubicación obtenida con precisión de ${accuracy} metros.`
          );

          if (this.map) {
            let zoomLevel;
            if (accuracy < 50) {
              zoomLevel = 18;
            } else if (accuracy < 100) {
              zoomLevel = 16;
            } else {
              zoomLevel = 14;
            }

            this.map.setView([lat, lon], zoomLevel);

            if (this.currentMarker) {
              console.log('Actualizando marcador con nuevas coordenadas');
              this.currentMarker.setLatLng([lat, lon]);
            } else {
              console.log('Añadiendo nuevo marcador con coordenadas');
              this.currentMarker = L.marker([lat, lon], {
                draggable: true,
              }).addTo(this.map);
            }
          }
        },
        (error) => {
          console.error('Error al obtener la geolocalización:', error);
          this.toastr.warning(
            'No se pudo obtener la geolocalización. El mapa no puede ser centrado.'
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error('La geolocalización no está soportada por este navegador.');
      this.toastr.warning(
        'La geolocalización no está soportada por este navegador.'
      );
    }
  }

  private addMarker(coords: [number, number]): void {
    if (coords && !isNaN(coords[0]) && !isNaN(coords[1])) {
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker);
      }

      this.currentMarker = L.marker(coords, { draggable: true }).addTo(
        this.map
      );

      this.currentMarker.on('drag', (event: L.LeafletEvent) => {
        const dragEndEvent = event as L.DragEndEvent;
        const position = event.target.getLatLng();
        this.latitud = position.lat;
        this.longitud = position.lng;
        console.log('Coordenadas al arrastrar:', this.latitud, this.longitud);
      });

      this.currentMarker.on('dragend', (event: L.DragEndEvent) => {
        const position = event.target.getLatLng();
        this.latitud = position.lat;
        this.longitud = position.lng;
        console.log('Marcador soltado en:', this.latitud, this.longitud);
      });
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

          // Si ya existe un marcador, lo eliminamos
          if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
          }

          // Añadimos un nuevo marcador en la ubicación encontrada, y lo hacemos draggable
          this.currentMarker = L.marker([firstResult.lat, firstResult.lon], {
            draggable: true,
          }).addTo(this.map);

          // Añadimos un popup al marcador
          this.currentMarker
            .bindPopup(`Ubicación encontrada: ${query}`)
            .openPopup();

          // Manejo del evento dragend para actualizar la ubicación al arrastrar el marcador
          this.currentMarker.on('dragend', (event: L.DragEndEvent) => {
            if (this.currentMarker) {
              const position = this.currentMarker.getLatLng();
              this.currentMarker.setLatLng(position);
              this.map.panTo(position);

              // Guardar la nueva ubicación
              const finalLat = position.lat;
              const finalLon = position.lng;
              console.log(
                `Nueva ubicación seleccionada: Latitud ${finalLat}, Longitud ${finalLon}`
              );

              this.cdr.detectChanges();
            }
          });

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

  registerField(userId: number): void {
    // Verificar si userId es válido y chacraSeleccionada está definida

    if (!userId || !this.chacraSeleccionada) {
      console.error('Datos de campo no seleccionados o inválidos.');
      return;
    }

    // Asignar el ID de la chacra seleccionada a la variable fieldId
    const fieldId = this.chacraSeleccionada.id;

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

    // Utilizamos el userId en lugar de idPerfilProd
    if (userId) {
      this.apiService
        .updateGeolocationField(userId, fieldId, geolocationString)
        .subscribe(
          (response: any) => {
            this.toastr.success(
              'Geolocalización actualizada con éxito',
              'Éxito'
            );
            this.router.navigate(['dashboard-backoffice/chacras-perfil']);
          },
          (error: any) => {
            this.toastr.error(
              'Error al actualizar la geolocalización',
              'Error'
            );
          }
        );
    } else {
      console.error('ID de usuario no válido');
    }
  }

  volver() {
    this.router.navigate(['dashboard-backoffice/chacras-perfil']);
  }

  cancelar() {
    this.router.navigate(['dashboard-backoffice/chacras-perfil']);
  }

  onMapClick(e: L.LeafletMouseEvent): void {
    if (!this.currentMarker) {
      this.currentMarker = L.marker(e.latlng).addTo(this.map);
    } else {
      this.currentMarker.setLatLng(e.latlng);
    }
  }
}
