import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from 'src/app/models/field.interface';
@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html',
  styles:  [`
    :host
      width: 100%

  `]
 
})
export class DynamicFormFieldComponent {
  @Input() field!: FieldConfig;
  @Input() group!: FormGroup;

  ngOnInit() {
    if (!this.field || !this.group) {
      console.error('Field or group not properly initialized in DynamicFormFieldComponent');
    }
  }

}
