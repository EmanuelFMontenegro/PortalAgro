import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-ver-lotes',
  templateUrl: './ver-lotes.component.html',
  styleUrls: ['./ver-lotes.component.scss'],
  standalone: true,
  imports: [MatTableModule],
})
export class VerLotesComponent {
  dataSource: any;
  mostrarLotes: boolean;

  displayedColumns = ['nombre', 'hectareas']

  constructor(public dialogRef: MatDialogRef<VerLotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
      this.dataSource = {};
      this.dataSource.data = this.data.plots
      console.log(this.data.plots)
      this.mostrarLotes = true;
    }






}
