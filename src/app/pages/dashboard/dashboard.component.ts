import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isScreenSmall = false;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isScreenSmall = result.matches;
        if (this.isScreenSmall && this.sidenav) {
          this.sidenav.close();
        } else if (!this.isScreenSmall && this.sidenav) {
          this.sidenav.open();
        }
      });
  }

  ngAfterViewInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isScreenSmall = result.matches;
        if (this.isScreenSmall) {
          this.sidenav.close();
        } else {
          this.sidenav.open();
        }
      });
  }


  toggleSidebar() {
    if (this.isScreenSmall && this.sidenav) {
      this.sidenav.toggle();
    }
  }

  closeSidenavIfSmall() {
    if (this.isScreenSmall && this.sidenav) {
      this.sidenav.close();
      console.log('Drawer cerrado en dispositivo móvil.');
    }
  }

  cerrarSesion(): void {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
