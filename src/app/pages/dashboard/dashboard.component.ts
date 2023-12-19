import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isScreenSmall: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isScreenSmall = result.matches;
        if (this.isScreenSmall) {
          this.sidenav.close();
        } else {
          this.sidenav.open();
        }
      });
  }

  closeSidenavIfSmall(): void {
    if (this.isScreenSmall) {
      this.sidenav.close();
    }
  }
}
