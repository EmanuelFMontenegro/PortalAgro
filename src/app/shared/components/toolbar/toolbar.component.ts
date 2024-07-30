import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent {
  @Output() toggle = new EventEmitter<void>();
  isScreenSmall = false;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ){}

  ngAfterViewInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 720px)'])
      .subscribe((result) => {
        this.isScreenSmall = result.matches;
      });
  }
  
  toogle(){
    this.toggle.emit();
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  toDashboard(){
    this.router.navigate(['/dashboard/notificaciones']);
  }
}
