import { Component, OnInit,Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { DashboardBackOfficeService } from 'src/app/pages/dashboard-backoffice/dashboard-backoffice.service';

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
  selector: 'app-titulo-container',
  templateUrl: './titulo-container.component.html',
  styleUrls: ['./titulo-container.component.sass'],
})
export class TituloContainerComponent implements OnInit {
  @Input() titulo: string = '';
  nombre: string = '';
  apellido: string = '';
  private userId: number | any;
  private companyId: number | any;
  public userEmail: string | null = null;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    public dashboardBackOffice: DashboardBackOfficeService
  ) {
    this.decodeToken();
    // this.dashboardBackOffice.dataTitulo.next({
    //   titulo: `¡ Bienvenido!, Acá podrás filtrar, los Usuarios Generales del Sistema !`,
    //   subTitulo: '',
    // });
  }
  ngOnInit(): void {}
  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;
    }
  }
  DatosDeUsuarioAdmin() {
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;

      this.companyId = 1;

      if (this.userId !== null && this.companyId !== null) {
        this.apiService.findUserById(this.companyId, this.userId).subscribe(
          (data) => {
            this.nombre = data.name;
            this.apellido = data.lastname;
          },
          (error) => {
            console.error('Error al obtener el nombre del usuario:', error);
          }
        );
      }
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }
}
