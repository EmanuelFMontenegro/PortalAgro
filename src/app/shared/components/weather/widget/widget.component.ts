import { Component, Input } from '@angular/core';
import { WeatherModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'w-widget',
  templateUrl: './widget.component.html', 
})
export class WeatherWidgetComponent {
  /* Mnadamos varios input y el type para no abstraer tanto el codigo y evitar seguir creando componentes */
  @Input() type?: 'today' | 'next' = 'today';
  @Input() dayName?: string = '';
  @Input() day?: any;
  @Input() location?: any;
  constructor(public dialogRef: MatDialog) {}

  
  open(data: any) {
    this.dialogRef.open(WeatherModalComponent, {
      data,
      width: '520px',
    });
  }


}
