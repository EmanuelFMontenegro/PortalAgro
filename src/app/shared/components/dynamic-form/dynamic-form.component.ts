import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldConfig } from 'src/app/models/field.interface';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DynamicFormComponent  implements OnInit {
  @Input() fields: FieldConfig[] = [];
  @Input() submitButtonText: string = 'Guardar';
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();
  form!: FormGroup;

  constructor(private fb: FormBuilder) { 
    this.form = this.createGroup();
  }

  ngOnInit() {
    this.form = this.createGroup();
  }


  createGroup(): FormGroup {
    const group = this.fb.group({});
    
    this.fields.forEach(field => {
      if (field && field.name) {
        const validators = [];
        
        if (field.validations) {
          if (field.validations.required) validators.push(Validators.required);
          if (field.validations.maxLength) validators.push(Validators.maxLength(field.validations.maxLength));
          if (field.validations.minLength) validators.push(Validators.minLength(field.validations.minLength));
          if (field.validations.min) validators.push(Validators.min(field.validations.min));
          if (field.validations.max) validators.push(Validators.max(field.validations.max));
          if (field.validations.pattern) validators.push(Validators.pattern(field.validations.pattern));
        }

        const control = new FormControl(field.value || '', validators);
        group.addControl(field.name, control);
      }
    });

    return group;
  }


  submit() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
    }
  }
}
