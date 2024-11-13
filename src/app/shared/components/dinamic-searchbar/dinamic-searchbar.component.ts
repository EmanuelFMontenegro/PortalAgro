import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';

import { FilterConfig, FilterValue, ButtonConfig } from 'src/app/models/searchbar.model';

@Component({
  selector: 'app-dinamic-searchbar',
  templateUrl: './dinamic-searchbar.component.html',
  styleUrls: ['./dinamic-searchbar.component.scss']
})
export class DinamicSearchbarComponent {
  private filtroActivo: boolean = false;
  
  @Output() clearFilter = new EventEmitter<void>();
  @Output() filter = new EventEmitter<FilterValue>();
  @Input() filterConfigs: FilterConfig[] = [];
  @Input() buttonConfigs: ButtonConfig[] = [];
  selectedFilter: FilterConfig;
  filterValue: any = {
    text: '',
    min: undefined,
    max: undefined,
    select: null
  };
  constructor(private router: Router) {
    this.selectedFilter = this.filterConfigs[0];
  }

  @Input() set localidadesOptions(value: any[]) {
    if (value) {
      this.updateFilterOptions('Localidad', value);
    }
  }

  @Input() set cultivosOptions(value: any[]) {
    if (value) {
      this.updateFilterOptions('Cultivos', value);
    }
  }


  Value: any = {
    text: '',
    min: undefined,
    max: undefined,
    select: null
  };

 

  ngOnInit(): void {
    this.selectedFilter = this.filterConfigs[0];
  }

  updateFilterOptions(type: string, options: any[]) {
    const config = this.filterConfigs.find(c => c.type === type);
    if (config) {
      config.options = options;
    }
  }
  hideSearchBar(): boolean {
    return !this.filterConfigs || this.filterConfigs.length === 0;
  }

  onFilterTypeChange(event: MatSelectChange) {
    this.selectedFilter = this.filterConfigs.find(c => c.type === event.value) || this.filterConfigs[0];
    this.clearFilterValue();
    if (this.selectedFilter.inputType === 'action') {
      this.onFiltrar();
    }
  }

  clearFilterValue() {
    this.filterValue = {
      text: '',
      min: undefined,
      max: undefined,
      select: null
    };
  }

  onFiltrar() {
 
    const filter: FilterValue = { type: this.selectedFilter.placeholder };
    
    switch (this.selectedFilter.inputType) {
      case 'text':
        filter.value = this.filterValue.text;
        break;
      case 'select':
      case 'select-options':
        filter.value = this.filterValue.select;
        break;
      case 'double-number':
        filter.min = this.filterValue.min;
        filter.max = this.filterValue.max;
        break;
      case 'action':
        filter.value = this.selectedFilter.actionValue;
        break;
    }
    console.log(filter)

    this.filter.emit(filter);
  }

  limpiarTexto() {
    this.clearFilterValue();
    this.clearFilter.emit();
  }

  onAddClick(config: ButtonConfig) {
    this.router.navigate([config.route]);
  }
}
