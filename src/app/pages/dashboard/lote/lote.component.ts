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
  selector: 'app-lote',
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.sass']
})
export class LoteComponent {
  nombre: string = '';
  campo:any;
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

  ) {


  }

  ngOnInit(): void {
    this.cargarDatosDeUsuario();
    this.userEmail = this.authService.getUserEmail();
    this.decodeToken();

    this.route.paramMap.subscribe(params => {
      const campoSeleccionadoParam = params.get('campoSeleccionado');
      if (campoSeleccionadoParam) {
        this.campoSeleccionado = JSON.parse(campoSeleccionadoParam);
      }
    });
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
  
}

