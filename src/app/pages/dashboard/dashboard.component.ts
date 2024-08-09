import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SidenavService } from 'src/app/services/sidenav.service';
interface Ellipses {
  left: string;
  top: string;
  right: string;
  bottom: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})



export class DashboardComponent implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  sidenavOpened: boolean = false;
  isScreenSmall = false;
  menuItems: any[] = [];
  svgPath = 'menu'
  ellipses: Ellipses = {
    left: 'assets/img/footer/ellipse_white.svg',
    top: 'assets/img/footer/ellipse_white_mobile.svg',
    right: 'assets/img/footer/ellipse_green.svg',
    bottom: 'assets/img/footer/ellipse_green_mobile.svg'
  }
  background = '#3BA549'
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private http: HttpClient,
    private sidenavService: SidenavService
  ) {
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
    this.http.get<any>('../../assets/json/menu-dashboard.json').subscribe(data => {
      this.menuItems = data.menuItems;
    });
  }
  onSidenavToggle(opened: boolean): void {
    if (!opened) {
      this.sidenavService.changeState(false);
    }
  }
}
