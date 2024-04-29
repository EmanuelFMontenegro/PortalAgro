import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

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
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.sass'],
})
export class InicioComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  nombre: string = '';
  apellido: string = '';
  descripcion: string = '';
  dniCuit: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  nombreCampo: string = '';
  localidad: string = '';
  nombreLocalidad: string = '';
  private userId: number | any;
  private companyId: number | any;
  public userEmail: string | null = null;
  localidades: any[] = [];
  campos: any[] = [];
  campoData = {
    name: '',
    dimensions: '',
    geolocation: '',
    observation: '',
    address: {
      address: '',
      locationDTO: '',
    },
  };

  addressTouched = false;
  locationTouched = false;
  nameTouched = false;
  dimensionsTouched = false;
  observationTouched = false;
  campoSeleccionado: any;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.decodeToken();
    // this.campoData.geolocation = '';
    // this.cargarCampos();
    this.DatosDeUsuarioAdmin();
  }

  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;
    }
  }

  navigateTo(pageName: string): void {
    this.router.navigateByUrl('/dashboard-backoffice/' + pageName);
  }

  DatosDeUsuarioAdmin() {
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;

      this.companyId = 1;

      if (this.userId !== null && this.companyId !== null) {
        // Llamada al método findUserById para obtener los datos del usuario
        this.apiService.findUserById(this.companyId,this.userId).subscribe(
          (data) => {
            // console.log("datos que trae el enpoint", data);
            // Extraer el nombre del usuario y asignarlo a la variable nombre
            this.nombre = data.name;
            this.apellido= data.lastname;
          },
          (error) => {
            console.error(
              'Error al obtener el nombre del usuario:',
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


  }
