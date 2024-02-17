import { Component, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isScreenSmall: boolean;
  isSidebarOpen: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private cdr: ChangeDetectorRef // Agregamos ChangeDetectorRef
  ) {
    this.isScreenSmall = window.innerWidth < 768;
  }

  ngAfterViewInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isScreenSmall = result.matches;
        this.cdr.detectChanges(); // Forzamos la detección de cambios
        if (this.isScreenSmall && this.sidenav) {
          this.sidenav.close();
        } else if (this.sidenav) {
          this.sidenav.open();
        }
      });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidenavIfSmall() {
    if (this.isScreenSmall) {
      this.isSidebarOpen = false;
    }
  }

  cerrarSesion(): void {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
