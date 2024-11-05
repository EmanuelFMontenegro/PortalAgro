export type FilterInputType = 'text' | 'select' | 'double-number' | 'select-options' | 'action';

export interface FilterConfig {
  type: string;
  placeholder: string;
  inputType: FilterInputType;
  options?: any[];
  property?: string;
  actionValue?: any; 
}

export interface FilterValue {
  type: string;
  value?: any;
  min?: number;
  max?: number;
}

export interface ButtonConfig {
  label: string;
  route: string;
  icon?: string;
  class?: string;
}