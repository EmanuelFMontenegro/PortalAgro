import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';

interface CustomJwtPayload {
  userId: number;
  sub: string;
}
interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
  companyId: number;
}
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
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
  name:string | null=null;
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
  homeItems: any[] = [];
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    public dashboardBackOffice: DashboardBackOfficeService)
    {
      this.dashboardBackOffice.dataTitulo.next({ titulo: `¡Bienvenido, ${this.nombre}  ${this.apellido} !` , subTitulo: ''})

  }

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.decodeToken();
    // this.campoData.geolocation = '';
    // this.cargarCampos();
    this.DatosDeUsuarioAdmin();
    this.loadMenu();
  }

  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
      this.name = decoded.name;
      this.userEmail = decoded.sub;
      this.companyId = decoded.companyId;
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }

  navigateTo(pageName: string): void {
    this.router.navigateByUrl('/dashboard-backoffice/' + pageName);
  }

  DatosDeUsuarioAdmin() {
    const token = this.authService.getToken();
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded && 'companyId' in decoded) {
        this.userId = decoded.userId;
        this.userEmail = decoded.sub;
        this.companyId = decoded.companyId;

        this.apiService.findUserById(this.companyId, this.userId).subscribe(
          (data) => {
            this.nombre = data.name;
            this.apellido = data.lastname;

            // Actualizas el título después de obtener los datos del usuario
            this.dashboardBackOffice.dataTitulo.next({
              titulo: `¡Bienvenido, ${this.nombre} ${this.apellido}!`,
              subTitulo: '',
            });
          },
          (error) => {
            console.error('Error al obtener el nombre del usuario:', error);
          }
        );
      } else {
        this.userId = null;
        this.userEmail = null;
        // Manejo adicional si es necesario
      }
    }
  }

  loadMenu(): void {
    this.http.get<any>('../../assets/json/home-dashboard-bo.json').subscribe(data => {
      this.homeItems = data.homeItems; 
    });
  }
}


  
