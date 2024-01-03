import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from 'src/app/services/AuthService';
import { ApiService } from 'src/app/services/ApiService';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { MatDialog } from '@angular/material/dialog';

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
  location: string;
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
  address: AddressData;
  contact: ContactData;
  person_id: number;
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
  fieldsData: { list: FieldData[] } = { list: [] };
  selectedFieldId: number | undefined;
  fieldId: number | undefined;
  fields: FieldData[] = [];
  fieldHasGeolocation: boolean = false;
  // field: any;
  canRegister: boolean = false;
  private misionesBoundingBox = {
    northWest: { lat: -25.5, lon: -56.5 },
    southEast: { lat: -28.5, lon: -53.5 }
  };

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    private http: HttpClient,
    private toastr: ToastrService,

  ) {
    this.token = this.authService.getToken();
    if (this.token) {
      const decoded: DecodedToken = jwtDecode(this.token);
      this.userId = decoded.userId;
      this.userEmail = decoded.emailId;
      // console.log('este es mail',this.userEmail)
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }

  searchFieldLocation(fieldArray: FieldArray): void {
    const geolocation = fieldArray.geolocation;

    if (!geolocation) {
      console.log('Geolocalización no cargada');
      this.fieldHasGeolocation = false; // No hay geolocalización
    } else {
      const [lat, lon] = geolocation.split(',').map(parseFloat);
      if (!isNaN(lat) && !isNaN(lon)) {
        // Resto de tu lógica para mostrar el mapa
        this.fieldHasGeolocation = true; // Hay geolocalización
      } else {
        console.error('Error en los datos de ubicación');
        this.fieldHasGeolocation = false; // No hay geolocalización válida
      }
    }
  }

  ngOnInit(): void {
    if (this.userId !== null) {
      this.loadUserFields();
    } else {
      console.error('El ID de usuario es null.');
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
            // console.log('Datos recibidos:', response);

            if (response && response.list && Array.isArray(response.list) && response.list.length > 0) {
              this.fields = response.list[0].map((item: any) => {
                const field: FieldData = {
                  id: item.id || 0,
                  name: item.name || '',
                  dimensions: item.dimensions || 0,
                  observation: item.observation || '',
                  geolocation: item.geolocation || '',
                  address: {
                    address: item.address ? item.address.address || '' : '',
                    location: item.address ? item.address.location || '' : ''
                  },
                  contact: {
                    id: item.contact ? item.contact.id || 0 : 0,
                    movilPhone: item.contact ? item.contact.movilPhone || null : null,
                    telephone: item.contact ? item.contact.telephone || null : null
                  },
                  person_id: item.person_id || 0
                };

                return field;
              });

              // Asignación del fieldId a selectedFieldId
              this.selectedFieldId = this.fields[0].id; // Aquí se asume que obtienes el primer fieldId de la lista, ajusta esta lógica si es diferente

              // console.log('Datos de la lista:', this.fields);
            } else {
              // console.log('Lista vacía o no disponible.');
            }
          },
          (error) => {
            console.error('Error al cargar los campos del usuario:', error);
          }
        );
      }
    }




  ngAfterViewInit(): void {
    if (this.userId !== null) {
      // console.log('este es userID',this.userId)
      this.initializeMap();
      this.loadInitialGeolocation();
      this.loadUserFields();
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
          // console.log('Datos de geolocalización recibidos:', response);
          if (response && response.geolocation) {
            const geoData = response.geolocation;
            if (geoData.latitude !== undefined && geoData.longitude !== undefined) {
              this.addMarker([geoData.latitude, geoData.longitude]);
              this.map.setView([geoData.latitude, geoData.longitude], 200);
            } else {
              this.toastr.info('Cargando datos de geolocalización.', 'Información');
            }
          } else {
            this.toastr.info('Existen Campos sin Geolocalizar, Por Favor actualizalos.', 'Información');
          }
        }, error => {
          console.error('Error al cargar la geolocalización:', error);
          this.toastr.info('No cuenta con campos para actualizar.', 'Atención');
        });
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
  updateGeolocation(item: FieldData): void {
    const misionesCoordinates: GeolocationData = {
      latitude: -27.3671, // Latitud de Misiones
      longitude: -55.8961, // Longitud de Misiones
    };

    const geolocationString = `${misionesCoordinates.latitude},${misionesCoordinates.longitude}`;

    this.apiService.updateGeolocationField(this.userId!, item.id, geolocationString)
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

  // ESTE METODO QUE AL DAR CLICK SE ATUALIZA EL CAMPO !!!
  // viewLocation(item: FieldData): void {
  //   if (item.geolocation) {
  //     const [latitude, longitude] = item.geolocation.split(',').map(parseFloat);
  //     // Lógica para mostrar la ubicación en un mapa utilizando Leaflet u otra librería similar
  //     // Por ejemplo, con Leaflet:
  //     const map = L.map('map').setView([latitude, longitude], 10);
  //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //       attribution: '© OpenStreetMap contributors'
  //     }).addTo(map);
  //     L.marker([latitude, longitude]).addTo(map)
  //       .bindPopup('Ubicación actual')
  //       .openPopup();
  //   }
  // }




  selectField(fieldName: string): void {
    const selectedField = this.fieldsData.list.find((field) => field.name === fieldName);
    if (selectedField) {
      this.selectedFieldId = selectedField.id; // Asignar el id en lugar del objeto completo
      // console.log('Campo seleccionado:', this.selectedFieldId);
      // Agregar registro para verificar la selección
    } else {
      console.warn('Campo no encontrado:', fieldName); // Registro de advertencia si el campo no se encuentra
    }
  }




  registerField(): void {
    if (!this.selectedFieldId || !this.userId) {
      console.error('Datos de campo no seleccionados o inválidos.');
      return;
    }

    if (!this.currentMarker || !this.currentMarker.getLatLng()) {
      console.error('Marcador no encontrado o sin ubicación.');
      return;
    }

    const latitude = this.currentMarker.getLatLng().lat;
    const longitude = this.currentMarker.getLatLng().lng;

    const geolocationString = `${latitude},${longitude}`;

    this.apiService.updateGeolocationField(this.userId, this.selectedFieldId, geolocationString)
      .subscribe(
        (response: any) => {
          // console.log(response);
          this.toastr.success('Geolocalización actualizada con éxito', 'Éxito');
          // Actualizar localmente los datos si es necesario
        },
        (error: any) => {
          this.toastr.error('Error al actualizar la geolocalización', 'Error');
        }
      );
  }



  onMapClick(e: L.LeafletMouseEvent): void {
    // Aquí actualizas la posición del marcador en el mapa
    if (!this.currentMarker) {
      this.currentMarker = L.marker(e.latlng).addTo(this.map);
    } else {
      this.currentMarker.setLatLng(e.latlng);
    }
  }










}
