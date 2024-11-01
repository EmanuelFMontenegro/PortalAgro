export interface WidgetConfig {
    title: string;
    value?: number;
    iconSrc: string;
    isSelected: boolean;
    isDisabled: boolean;
    widgetId: number;
  }

 
  
  export interface WidgetState {
    isSelected: boolean;
    isDisabled: boolean;
  }