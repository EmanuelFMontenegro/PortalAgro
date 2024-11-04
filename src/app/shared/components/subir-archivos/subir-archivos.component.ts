import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-subir-archivos',
  templateUrl: './subir-archivos.component.html',
  styleUrls: ['./subir-archivos.component.scss']
})
export class SubirArchivosComponent {

  @Input() nombreBoton = 'Subir archivo'
  @Output() uploadFile = new EventEmitter<any>();

  fileName: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
      this.uploadFile.emit(input.files[0])
    }
  }

  quitarArchivo(){
    this.fileName = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
      this.uploadFile.emit(null)
    }
  }

}
