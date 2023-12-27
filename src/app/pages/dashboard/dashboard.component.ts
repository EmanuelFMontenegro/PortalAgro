import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
  isScreenSmall: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver,private router: Router) {}

  ngAfterViewInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isScreenSmall = result.matches;
        // Uso de setTimeout para evitar el error ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          if (this.isScreenSmall) {
            this.sidenav.close();
          } else {
            this.sidenav.open();
          }
        });
      });
  }

  cerrarSesion(): void {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  closeSidenavIfSmall(): void {
    if (this.isScreenSmall && this.sidenav) {
      this.sidenav.close();
    }
  }
}
