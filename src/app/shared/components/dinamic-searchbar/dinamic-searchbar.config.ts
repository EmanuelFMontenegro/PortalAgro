import { FilterConfig, ButtonConfig } from '../../../models/searchbar.model';
export const FILTER_CONFIGS: { [key: string]: FilterConfig } = {
    //aca agrega nomas los filtros que necesites 
    LOCALIDAD: {
      type: 'Localidad',
      placeholder: 'Buscar por Localidad',
      inputType: 'select-options',
      options: [],
      property: 'name'
    },
    NOMBRE_CHACRA: {
      type: 'Nombre de Chacra',
      placeholder: 'Buscar por Nombre de Chacra',
      inputType: 'text'
    },
    PRODUCTOR: {
      type: 'Productor',
      placeholder: 'Buscar por Productor',
      inputType: 'text'
    },
    NOMBRE_PRODUCTOR: {
      type: 'NombreProductor',
      placeholder: 'Buscar por Nombre',
      inputType: 'text'
    },
    APELLIDO_PRODUCTOR: {
      type: 'ApellidoProductor',
      placeholder: 'Buscar por Apellido',
      inputType: 'text'
    },
    HECTAREAS: {
      type: 'Hectareas',
      placeholder: 'Buscar por Hectáreas',
      inputType: 'double-number'
    },
    CULTIVO: {
      type: 'Cultivos',
      placeholder: 'Buscar por Cultivo',
      inputType: 'select',
      options: [],
      property: 'name'
    },
    //este seria un filtro sin input, como el filtro por cargo, que ya tiene un valor por defecto
    //el actionValue es el valor que le enviamos al filtro en el event emit para que lo tome el padre
    FILTRO_SIN_INPUT_EJEMPLO: {
        type: 'Filtro sin input ejemplo',
        placeholder: 'Filtro sin input ejemplo',
        inputType: 'action',
        actionValue: 'Colonia Alberdi'
      },
      LISTA_DRONES: {
        type: 'Lista de drones',
        placeholder: 'Filtro para lista de drones',
        inputType: 'action',
        actionValue: 'Drones'
      }, 
      LISTA_INSUMOS: {
        type: 'Lista de insumos',
        placeholder: 'Filtro para lista de insumos',
        inputType: 'action',
        actionValue: 'Insumos'
      },
      /* Para usuarios sin input */
      GERENTE: {
        type: 'Gerente',
        placeholder: 'Filtro para lista de gerentes',
        inputType: 'action',
        actionValue: 'Gerente General'
      },
      TECHNICAL: {
        type: 'Técnico',
        placeholder: 'Filtro para lista de técnicos',
        inputType: 'action',
        actionValue: 'Técnico'
      },
      SUPERUSER:{
        type: 'Super Admin',
        placeholder: 'Filtro para lista de super admins',
        inputType: 'action',
        actionValue: 'Super Admin'
      },
      ADMINISTRATOR: {
        type: 'Administrador',
        placeholder: 'Filtro para lista de técnicos generales',
        inputType: 'action',
        actionValue: 'Administrador'
      },
      OPERATOR: {
        type: 'Piloto',
        placeholder: 'Filtro para lista de pilotos',
        inputType: 'action',
        actionValue: 'Piloto'
      },
      COOPERATIVE: {
        type: 'Cooperativa',
        placeholder: 'Filtro para lista de cooperativas',
        inputType: 'action',
        actionValue: 'Cooperativa'
      },
  };
  export const BUTTON_CONFIGS: { [key: string]: ButtonConfig } = {
    // lo mismo con los botones, agrega los que necesites y podes cambiar el icon y la clase 
    REGISTRAR_CHACRAS: {
      label: 'Registrar Chacras',
      route: '/dashboard/campo',
      icon: 'add',
      class: 'primary-button-auto'
    },
    NUEVO_LOTE: {
      label: 'Agregar Lote',
      route: '/dashboard/cargar-lote',
      icon: 'add',
      class: 'primary-button-auto'
    },
    NUEVO_USUARIO_ROLE:{
      label: 'Nuevo Usuario',
      route: 'dashboard-backoffice/usuarios',
      icon: 'add',
      class: 'primary-button-auto'
    },
    NUEVO_USUARIO: {
      label: 'Nuevo Usuario',
      route: 'dashboard-backoffice/nuevo-usuario',
      icon: 'person_add',
      class: 'primary-button-auto'
    },
    REGISTRAR_CHACRA_P: {
      label: 'Registrar Chacra',
      route: 'dashboard-backoffice/cargar-chacras',
      icon: 'add',
      class: 'primary-button-auto'
    },
    AGREGAR_PRODUCTOR: {
        label: 'Agregar Productor',
        route: 'dashboard-backoffice/agregar-productor',
        icon: 'add',
        class: 'primary-button-auto'
    },
    AGREGAR_DRON: {
        label: 'Agregar Dron',
        route: 'dashboard-backoffice/configuracion/dron',
        icon: 'add',
        class: 'primary-button-auto'
    },
    AGREGAR_INSUMO: {
        label: 'Agregar Insumo',
        route: 'dashboard-backoffice/configuracion/insumo',
        icon: 'add',
        class: 'primary-button-auto'
    }
  };
  
  export function selectFilters(filterKeys: string[]): FilterConfig[] {
    return filterKeys.map(key => FILTER_CONFIGS[key]).filter(Boolean);
  }
  
  export function selectButtons(buttonKeys: string[]): ButtonConfig[] {
    return buttonKeys.map(key => BUTTON_CONFIGS[key]).filter(Boolean);
  }