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
  ) {}

  ngAfterViewInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isScreenSmall = result.matches;
      });
  }

  toggleSidebar() {
    if (this.isScreenSmall && this.sidenav) {
      this.sidenav.toggle();
    }
  }

  closeSidenav(): void {
    if (this.isScreenSmall && this.sidenav) {
      this.sidenav.close();
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
