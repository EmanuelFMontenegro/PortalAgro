import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  isMobile = false;
  whiteLogo= false;

  constructor(breakpoints : BreakpointObserver) { 
    breakpoints.observe(['(max-width: 768px)','(min-width: 569px)']).subscribe(result => {
      this.isMobile = result.breakpoints['(max-width: 768px)'];
      this.whiteLogo = result.breakpoints['(min-width: 569px)'] && result.breakpoints['(max-width: 768px)'];
    });

  }
  onInit() { 
  }
}
