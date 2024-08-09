import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { SidenavService } from 'src/app/services/sidenav.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/AuthService';
interface Ellipses {
  left: string;
  top: string;
  right: string;
  bottom: string;
}
@Component({
  selector: 'app-dashboard-backoffice',
  templateUrl: './dashboard-backoffice.component.html',
  styleUrls: ['./dashboard-backoffice.component.sass']
})
export class DashboardBackofficeComponents implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  sidenavOpened: boolean = false;
  isScreenSmall = false;
  menuItems: any[] = [];
  svgPath = 'menu'
  ellipses: Ellipses = {
    left: 'assets/img/footer/ellipse_white.svg',
    top: 'assets/img/footer/ellipse_white_mobile.svg',
    right: 'assets/img/footer/ellipse_blue.svg',
    bottom: 'assets/img/footer/ellipse_blue_mobile.svg'
  }
  background = '#015E83'
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private sidenavService: SidenavService
  ) {
    this.authService.getUserLogeed()
    this.loadMenu();
    this.sidenavService.sidenavOpen$.subscribe(open => {
      this.sidenavOpened = open;
    });
  }

  ngAfterViewInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 720px)'])
      .subscribe((result) => {
        this.isScreenSmall = result.matches;
        console.log(this.isScreenSmall)
        this.sidenav.mode = this.isScreenSmall ? 'over' : 'side';
      });

  }

  toggleSidenav() {
    if (this.isScreenSmall && this.sidenav) {
      this.sidenavService.toggle();
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  loadMenu(): void {
    this.http.get<any>('../../assets/json/menu-dashboard-bo.json').subscribe(data => {
      this.menuItems = data.menuItems;
    });
  }
  onSidenavToggle(opened: boolean): void {
    if (!opened) {
      this.sidenavService.changeState(false);
    }
  }

  /* mostrarMenu(menuName: string) {
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
  } */
}



