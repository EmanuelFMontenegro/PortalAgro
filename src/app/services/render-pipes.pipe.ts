import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'renderProvinces'
})
export class RenderProvincesPipe implements PipeTransform {
  transform(value: any): string {
    if (Array.isArray(value)) {
      return value.map(provincia => provincia.name).join(', ');
    } else {
      return '';
    }
  }
}

@Pipe({
  name: 'renderDepartments'
})
export class RenderDepartmentsPipe implements PipeTransform {
  transform(value: any): string {
    if (Array.isArray(value)) {
      return value.map(dep => dep.name).join(', ');
    } else if (typeof value === 'object' && value !== null) {
      return value.name; // Renderiza solo el nombre si es un objeto singular
    } else {
      return '';
    }
  }
}
