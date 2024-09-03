import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-header-inner',
  templateUrl: './header-inner.component.html',
  styleUrls: ['./header-inner.component.scss']
})
export class HeaderInnerComponent {
  @Input() title?: string = '';
  @Input() backButton?: boolean = false;

  volver(){
    window.history.back();
  }
}
