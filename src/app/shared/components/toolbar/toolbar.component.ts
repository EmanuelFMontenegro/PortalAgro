import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router'; 
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  @Output() toggle = new EventEmitter<void>();
  isScreenSmall = false;
  theme =''
  url = ''
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private themeService: ThemeService
  ){
    this.theme = this.themeService.getTheme();
  }

  ngAfterViewInit(): void {
    
    this.setRoute();
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

  getDashboardType(){
     console.log(sessionStorage.getItem('app-theme'));
  }

  setRoute(){
    this.theme === 'dashboard' ? this.url = '/dashboard/perfil' : this.url = '/dashboard-backoffice/productores';
 
  
  }

  toPerfil(){
    this.router.navigate([this.url]);
  }
}
