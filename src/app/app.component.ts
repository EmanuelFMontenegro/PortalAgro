import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  constructor(private themeService: ThemeService) {
  }
   ngOnInit() {
    const savedTheme = this.themeService.getTheme();
    if (savedTheme) {
      this.themeService.applyTheme(savedTheme);
    }
    
  }
}
