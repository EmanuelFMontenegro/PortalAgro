import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-calendar-popup',
  templateUrl: './calendar-popup.component.html',
  styleUrls: ['./calendar-popup.component.scss']
})
export class CalendarPopupComponent {
  constructor(public dialogRef: MatDialogRef<CalendarPopupComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

  } 
  

}
