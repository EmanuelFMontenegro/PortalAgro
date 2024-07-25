import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  isMobile = false;
  constructor(breakpoints : BreakpointObserver) { 
    breakpoints.observe(['(max-width: 768px)']).subscribe(result => {
      this.isMobile = result.matches;
    });

  }
  onInit() {
    console.log(this.isMobile);
  }
}
