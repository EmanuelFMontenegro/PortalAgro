import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from 'src/app/services/ApiService';
import { AuthService } from 'src/app/services/AuthService';
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
  styleUrls: ['./detalle-campo.component.scss']
})
export class DetalleCampoComponent implements OnInit, AfterViewInit {
  public userEmail: string | null = null;
  private userId: number | any;
  private personId: number | any;
  public campoSeleccionado: any = {};
  mostrarMapaPrincipal: boolean = false;
  mostrarImagenPrincipal: boolean = false;
  public nombre: string = '';
  public apellido: string = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.cargarDatosDeUsuario();
    this.decodeToken();
    const campoSeleccionadoParam = localStorage.getItem('campoSeleccionado');
    if (campoSeleccionadoParam) {
      this.campoSeleccionado = JSON.parse(campoSeleccionadoParam);
      if (this.campoSeleccionado.geolocation) {
        this.mostrarMapaPrincipal = true;
      } else {
        this.mostrarImagenPrincipal = true;
        this.toastr.warning('Tu campo no se encuentra geolocalizado', 'Atencion');
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.mostrarMapaPrincipal) {
      this.mostrarMapa();
    }
  }

  mostrarMapa(): void {
    if (this.campoSeleccionado.geolocation) {
      const mapElement = document.getElementById('map');
      if (mapElement) {
        const geolocationData = this.campoSeleccionado.geolocation.split(',').map(parseFloat);
        const latitude = geolocationData[0];
        const longitude = geolocationData[1];
        const map = L.map(mapElement).setView([latitude, longitude], 15);
        L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(map);
        L.marker([latitude, longitude]).addTo(map).bindPopup('Ubicación del campo').openPopup();

      }
    }
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
        this.apiService.getPersonByIdProductor(this.userId, this.personId).subscribe(
          (data) => {
            this.nombre = data.name;
            this.apellido = data.lastname;
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

  geolocalizar() {
    if (this.campoSeleccionado) {
      localStorage.setItem('campoSeleccionado', JSON.stringify(this.campoSeleccionado));
      this.router.navigate(['/dashboard/geolocalizacion']);
    } else {
      this.toastr.warning('No se ha seleccionado ningún campo', 'Advertencia');
    }
  }

  volver() {
    this.router.navigate(['dashboard/chacras']);
  }

  verLotes() {
    this.router.navigate(['dashboard/lote']);
  }

  cancelar() {
    this.router.navigate(['dashboard/inicio']);
  }
}
