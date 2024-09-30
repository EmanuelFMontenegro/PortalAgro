import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = 'app-theme';

  constructor() { }

  setTheme(theme: 'dashboard' | 'backoffice') {
    sessionStorage.setItem(this.themeKey, theme);
    this.applyTheme(theme);
  }

  getTheme(): 'dashboard' | 'backoffice' {
    return sessionStorage.getItem(this.themeKey) as 'dashboard' | 'backoffice';
  }
  applyTheme(theme: 'dashboard' | 'backoffice') {
    if (theme === 'backoffice') {
      document.body.classList.remove('dashboard-theme');
      document.body.classList.add('backoffice-theme');
    } else {
      document.body.classList.remove('backoffice-theme');
      document.body.classList.add('dashboard-theme');
    }
  }
}