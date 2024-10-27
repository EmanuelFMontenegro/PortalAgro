import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-contador',
  templateUrl: './card-contador.component.html',
  styleUrls: ['./card-contador.component.sass']
})
export class CardContadorComponent {
  @Input() contador: number = 0;
  @Input() mensaje: string = '';
}
