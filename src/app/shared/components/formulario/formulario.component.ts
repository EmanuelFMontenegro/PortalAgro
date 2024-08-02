import { Component, Input, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

export interface DataForm {
  type: 'text' | 'file' | 'select' | 'password' | 'textarea' | 'checkbox';
  placeholder: string;
  ngModel: string;
  name: string;
  value?: any;
  multiple?: boolean;
  options?: { value: any; text: string }[];
  onChange?: (event: any) => void;
  readonly?: boolean;
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class FormularioComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() formData: any;
  @Input() dataForm: any;
  @Input() fields: DataForm[] = [];
  @Output() formSubmitted = new EventEmitter<any>();
  @Input() formType: string = '';
  @Input() titulo: string = '';




  ngOnInit() {
    this.initializeFormData();
  }

  initializeFormData() {
    this.formData = {};

  }

  updateFormData() {
    this.formSubmitted.emit(this.formData);
  }

  onFileChange(event: any, fieldName: string) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData[fieldName] = e.target?.result; // Almacena la imagen en formData
      };
      reader.readAsDataURL(file);
    }
  }

  updateSelectedDepartments(event: any, ngModel: string) {
    this.formData[ngModel] = event.value;
  }

  getDescripcionDepartament(idDepartament: number, listadoDepartament: any) {
    return listadoDepartament.find((departamento: any) => departamento.value == idDepartament).text;
  }

  addDepartment(event: MatChipInputEvent, modelName: string): void {
    const input = event.input;
    const value = event.value;

    // Añadir el chip al array de departamentos si no está vacío
    if ((value || '').trim()) {
      this.formData[modelName] = this.formData[modelName] || [];
      this.formData[modelName].push(value.trim());
    }

    // Limpiar el valor de entrada
    if (input) {
      input.value = '';
    }

    this.updateFormData();  // Si necesitas actualizar los datos en tu modelo principal
  }

  removeDepartment(department: string, modelName: string) {
    // Implementa la lógica para remover un departamento
    this.formData[modelName] = this.formData[modelName].filter((dep: string) => dep !== department);
  }

  getOptionText(options: { value: any; text: string }[], value: any): string {
    const option = options.find(opt => opt.value === value);
    return option ? option.text : value;
  }

  cancel() {}
}
