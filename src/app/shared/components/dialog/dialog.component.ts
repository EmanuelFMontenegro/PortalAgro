import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.sass'],
})
export class DialogComponent {
  title: string = '';
  message: string = '';
  buttonText: string = 'Aceptar';
  showCancel: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>
  ) {
    if (data && data.message) {
      this.message = data.message;
      this.title = data.title || 'Acceso Restringido !!!';
      this.buttonText = data.buttonText || 'Aceptar';
      this.showCancel = data.showCancel !== undefined ? data.showCancel : true;
    }
  }

  aceptarClick() {
    this.dialogRef.close(true);
  }
}
