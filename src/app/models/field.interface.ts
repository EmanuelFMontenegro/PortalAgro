export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  validations?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  options?: { id: any; name: string }[];
  placeholder?: string;
  value?: any
  }

  export interface FormConfig {
    fields: FieldConfig[];
    submitButtonText: string;
    cancelButtonText: string;
  }