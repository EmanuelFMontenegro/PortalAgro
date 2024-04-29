import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router, ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';


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
  selector: 'app-productores',
  templateUrl: './productores.component.html',
  styleUrls: ['./productores.component.sass']
})
export class ProductoresComponent {
  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  localidades: any[] = [];
  private userId: number | any;
  private personId: number | any;
  public userEmail: string | null = null;

constructor(
  private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
){

}
ngOnInit(): void {
  const campoSeleccionadoParam = localStorage.getItem('campoSeleccionado');
  const campoSeleccionado = campoSeleccionadoParam
    ? JSON.parse(campoSeleccionadoParam)
    : null;
  if (campoSeleccionado) {
    const campoId = campoSeleccionado.id;

  }
  this.decodeToken();
  this.cargarDatosDeUsuario();
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
cargarProductores() {
  // Lógica para cargar los productores
}

// Las siguientes funciones podrían ser implementadas para filtrar por localidad, apellido y nombre
filtrarPorLocalidad(value: string) {
  // Lógica para filtrar por localidad
}

filtrarPorApellido(value: string) {
  // Lógica para filtrar por apellido
}

filtrarPorNombre(value: string) {
  // Lógica para filtrar por nombre
}

volver() {
  this.router.navigate(['dashboard-backoffice/inicio']);
}
}
