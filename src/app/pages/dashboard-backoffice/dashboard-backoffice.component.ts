import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { DashboardBackOfficeService } from './dashboard-backoffice.service';
import { PermisoService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-dashboard-backoffice',
  templateUrl: './dashboard-backoffice.component.html',
  styleUrls: ['./dashboard-backoffice.component.sass']
})
export class DashboardBackofficeComponents implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isScreenSmall: boolean;

  titulo: string | undefined;
  subTitulo: string | undefined;
  cargandoPermisos = true;
  constructor(
    private breakpointObserver: BreakpointObserver,
    public permisoService: PermisoService,
    public dashboardBackOffice: DashboardBackOfficeService,
    private router: Router
  ) {
    this.isScreenSmall = window.innerWidth < 768;
    this.dashboardBackOffice.dataTitulo.subscribe(
      data => {
        if (data?.titulo) this.titulo = data?.titulo
        if (data?.subTitulo) this.subTitulo = data?.subTitulo
      }
    )
  }

  ngOnInit(): void {
    this.getPermisos()
  }

  async getPermisos() {
    await this.permisoService.getPermisos()
    this.cargandoPermisos = false;
    console.log(this.permisoService.permisoUsuario.value)
  }

  ngAfterViewInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isScreenSmall = result.matches;
        if (this.isScreenSmall && this.sidenav) {
          this.sidenav.close();
        } else if (this.sidenav) {
          this.sidenav.open();
        }
      });
  }

  toggleSidebar() {
    if (this.isScreenSmall && this.sidenav) {
      this.sidenav.toggle();
    }
  }

  mostrarMenu(menuName: string) {
    let puedeVerMenu = false;
    let permiso = this.permisoService.permisoUsuario.value;
    switch (menuName) {
      case 'DRON':
        if (permiso?.drone?.READ) puedeVerMenu = permiso?.drone.READ
        break;
      case 'INSUMOS':
        if (permiso?.supplies?.READ) puedeVerMenu = permiso?.supplies.READ
        break;

      default:
        break;
    }

    return permiso
  }


  closeSidenavIfSmall() {
    if (this.isScreenSmall && this.sidenav) {
      this.sidenav.close();

    }
  }
  cerrarSesion(): void {

    localStorage.removeItem('token');
    this.router.navigate(['/login-backoffice']);
  }
}



