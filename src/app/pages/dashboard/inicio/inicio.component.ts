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
  location: number | null = null;
  telephone: string = '';
  nombreCampo: string = '';
  localidad: string = '';
  nombreLocalidad: string = '';
  private companyId: number | any;
  private userId: number | any;
  private personId: number | any;
  public userEmail: string | null = null;
  localidades: any[] = [];
  homeItems: any[] = [];
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
    this.cargarDatosDeUsuario();
    this.loadMenu();
  }

  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userId = decoded.userId;
        this.userEmail = decoded.sub;
        this.companyId = decoded.companyId;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }

  navigateTo(pageName: string): void {
    this.router.navigateByUrl('/dashboard/' + pageName);
  }

  cargarDatosDeUsuario() {
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;
      this.companyId = decoded.companyId;
      this.personId = this.userId;

      if (this.userId !== null && this.personId !== null) {
        this.apiService.getLocationMisiones('location').subscribe(
          (localidades) => {
            this.localidades = localidades;

            let nombreLocalidad: string = '';

            this.apiService
              .getPersonByIdProductor(this.userId, this.personId)
              .subscribe(
                (data) => {
                  const localidad = this.localidades.find(
                    (loc) => loc.id === data.location.id
                  );
                  this.location = localidad ? localidad.name : null;
                  this.nombreLocalidad = nombreLocalidad;
                  this.nombre = data.name;
                  this.apellido = data.lastname;
                  this.dniCuit = data.dniCuit;
                  this.descriptions = data.descriptions;
                  this.telephone = data.telephone;
                },
                (error) => {
                  console.error(
                    'Error al obtener nombre y apellido del usuario:',
                    error
                  );
                }
              );
          },
          (error) => {
            console.error('Error al obtener las localidades', error);
          }
        );
      }
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }

  loadMenu(): void {
    this.http
      .get<any>('../../assets/json/home-dashboard.json')
      .subscribe((data) => {
        this.homeItems = data.homeItems;
      });
  }
}
