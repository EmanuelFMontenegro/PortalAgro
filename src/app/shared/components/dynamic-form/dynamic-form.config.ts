import { FormConfig } from "src/app/models/field.interface";

export const FORM_CONFIGS: { [key: string]: FormConfig } = {
    REGISTRO_CHACRA: {
      fields: [
        {
          name: 'name',
          label: 'Nombre',
          type: 'text',
          placeholder: 'Nombre de la chacra',
          validations: {
            required: true,
            maxLength: 30
          }
        },
        {
          name: 'localidad',
          label: 'Localidad',
          type: 'select',
          validations: {
            required: true
          },
          options: []
        },
        {
          name: 'address',
          label: 'Dirección',
          type: 'text',
          placeholder: 'Dirección de la chacra',
          validations: {
            required: true,
            maxLength: 255
          }
        },
        {
          name: 'dimensions',
          label: 'Dimensiones (Hectáreas)',
          type: 'number',
          placeholder: 'Ingresar valores en hectáreas',
          validations: {
            required: true,
            min: 1,
            max: 1000000
          }
        },
        {
          name: 'observation',
          label: 'Descripción',
          type: 'textarea',
          placeholder: 'Descripción',
          validations: {
            required: true,
            maxLength: 255
          }
        }
      ],
      submitButtonText: 'Registrar Chacra',
      cancelButtonText: 'Cancelar'
    }
  };
  
  // Función auxiliar para seleccionar una configuración
  export function getFormConfig(formKey: string): FormConfig {
    const config = FORM_CONFIGS[formKey];
    if (!config) {
      throw new Error(`No se encontró la configuración del formulario para la clave: ${formKey}`);
    }
    return {...config}; // Retornamos una copia para evitar modificar el original
  }
  
  // Función para actualizar las opciones de un select dinámicamente
  export function updateFormConfigOptions(
    config: FormConfig, 
    fieldName: string, 
    options: { id: any; name: string }[]
  ): FormConfig {
    const updatedConfig = {...config};
    const field = updatedConfig.fields.find(f => f.name === fieldName);
    if (field && field.type === 'select') {
      field.options = options;
    }
    return updatedConfig;
  }