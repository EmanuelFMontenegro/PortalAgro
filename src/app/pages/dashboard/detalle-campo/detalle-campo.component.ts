import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';

interface CustomJwtPayload {
  userId: number;
  sub: string;
}

interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
}

@Component({
  selector: 'app-detalle-campo',
  templateUrl: './detalle-campo.component.html',
  styleUrls: ['./detalle-campo.component.sass']
})
export class DetalleCampoComponent {
  mapaGeolocalizacion: { latitud: number, longitud: number } | null = null;
  mostrarMapaPrincipal: boolean = false;
  private map!: L.Map;
  imagenPrincipal: string = '';
  nombre: string = '';
  apellido: string = '';
  descripcion: string = '';
  dni: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  modoEdicion: boolean = false;
  persona: any = {};
  localidades: any[] = [];
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades = new FormControl('');
  private userId: number | any;
  private personId: number | any;
  public userEmail: string | null = null;

  campoData = {
    name: '',
    dimensions: '',
    geolocation: '',
    address: {
      address: '',
      location: ''
    }
  };
  nameTouched = false;
  dimensionsTouched = false;
  geolocationTouched = false;
  locationTouched = false;
  addressTouched = false;
  observationTouched = false;
  campoSeleccionado: any = {};

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarDatosDeUsuario();
    this.userEmail = this.authService.getUserEmail();
    this.decodeToken();

    const campoSeleccionadoParam = localStorage.getItem('campoSeleccionado');
    if (campoSeleccionadoParam) {
      this.campoSeleccionado = JSON.parse(campoSeleccionadoParam);
      this.mostrarGeolocalizacion();
    } else {
      // Manejar el caso en que no haya ningún campo seleccionado en el localStorage
    }
  }
  // mostrarMapa() {
  //   // Lógica para mostrar el mapa interactivo y obtener la geolocalización
  //   this.mapaGeolocalizacion = { latitud: 51.505, longitud: -0.09 }; // Ejemplo de geolocalización
  // }
  cambiarImagenPrincipal(foto: string) {
    // Verificar si la foto es el mapa interactivo
    if (foto === 'mapa_interactivo') {
      this.mostrarMapaPrincipal = true;
      this.mostrarMapa();
    } else {
      this.mostrarMapaPrincipal = false;
      // Lógica adicional para mostrar la imagen principal correspondiente a la imagen secundaria seleccionada
    }
  }

  mostrarMapa() {
    // Lógica para mostrar el mapa interactivo utilizando Leaflet u otra biblioteca de mapas
    const mapElement = document.getElementById('map');
    if (mapElement) {
      // Crea el mapa y realiza la configuración necesaria
      this.map = L.map(mapElement).setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      // Añade marcadores u otras capas al mapa según sea necesario
      L.marker([51.5, -0.09]).addTo(this.map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();
    }
  }

  seleccionarCampo(campoId: number) {
    // Aquí asumo que campoId es el ID del campo seleccionado
    // Navegar a la vista de geolocalización y pasar el ID del campo seleccionado
    this.router.navigate(['dashboard/geolocalizacion']);
  }
  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;
    }
  }

  cargarDatosDeUsuario() {
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;

      this.personId = this.userId;

      if (this.userId !== null && this.personId !== null) {
        this.apiService.getPersonByIdOperador(this.userId, this.personId).subscribe(
          (data) => {
            this.nombre = data.name;
            this.apellido = data.lastname;
            this.dni = data.dni;
            this.descriptions = data.descriptions;
            this.telephone = data.telephone;
            const localidad = this.localidades.find((loc) => loc.id === data.location_id);
            this.locationId = localidad ? localidad.name.toString() : '';
          },
          (error) => {
            console.error('Error al obtener nombre y apellido del usuario:', error);
          }
        );
      }
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }

  TraerDatosdeCampo(): void {
    if (!this.userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    // Asumo que necesitas el ID del campo, asegúrate de tener el ID correcto o ajusta según sea necesario
    const campoId = 1; // Reemplaza con el ID real del campo que deseas traer

    // Realizar la solicitud para obtener los datos del campo por su ID
    this.apiService.getFields(this.userId).subscribe(
      (campos) => {
        const campoSeleccionado = campos.find((campo: { id: number }) => campo.id === campoId);

        if (campoSeleccionado) {
          // Asignar los datos del campo al objeto campoSeleccionado
          this.campoSeleccionado = campoSeleccionado;
          console.log("datos del campo vermas ", this.campoSeleccionado);
          // Llamar a la función para mostrar la geolocalización del campo
          this.mostrarGeolocalizacion();
        } else {
          this.toastr.error('Campo no encontrado', 'Error');
        }
      },
      (error) => {
        console.error('Error al obtener la lista de campos:', error);
        // Manejar el error según tus necesidades, por ejemplo, mostrar un mensaje de error
        this.toastr.error('Error al obtener la lista de campos', 'Error');
      }
    );
  }

  mostrarGeolocalizacion(): void {
    if (this.campoSeleccionado.geolocation) {
      const mapElement = document.getElementById('map');
      if (mapElement) {
        const geolocationData = this.campoSeleccionado.geolocation.split(',').map(parseFloat);
        const latitude = geolocationData[0];
        const longitude = geolocationData[1];

        const map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.marker([latitude, longitude]).addTo(map)
          .bindPopup('Ubicación del campo').openPopup();
      } else {
        this.toastr.warning('El contenedor del mapa no se encontró en el DOM.', 'Advertencia');
      }
    } else {
      this.toastr.warning('El campo no tiene información de geolocalización', 'Advertencia');
    }
  }

  geolocalizar() {
    if (this.campoSeleccionado) {
      console.log('Campo seleccionado estando en detalle-campo:', this.campoSeleccionado);
      localStorage.setItem('campoSeleccionado', JSON.stringify(this.campoSeleccionado));
      this.router.navigate(['/dashboard/geolocalizacion']); // Usar una ruta relativa a 'dashboard'
    } else {
      this.toastr.warning('No se ha seleccionado ningún campo', 'Advertencia');
    }
  }

  volver() {
    this.router.navigate(['dashboard/inicio']);
  }

  verLotes() {
    this.router.navigate(['dashboard/lote']);
  }

  cancelar() {
    this.router.navigate(['dashboard/inicio']);
  }
}
