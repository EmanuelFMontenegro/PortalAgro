import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'w-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class WeatherModalComponent {

  constructor(public dialogRef: MatDialogRef<WeatherModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
    }

}
