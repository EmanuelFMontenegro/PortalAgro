import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

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
})
export class FormularioComponent implements OnChanges {
  @Input() formType: string = '';
  @Input() titulo: string = '';
  @Input() dataForm: DataForm[] = [];
  formData: any = {};

  @Output() formSubmitted = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataForm']) {
      this.initializeFormData();
    }
  }

  initializeFormData() {
    this.formData = {};
    this.dataForm.forEach(field => {
      this.formData[field.ngModel] = field.value || '';
    });
  }

  updateFormData() {
    this.formSubmitted.emit(this.formData);
  }
}
