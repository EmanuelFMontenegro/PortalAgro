/** Para que el componente sepa que dibujar cuando toma el objeto */
export enum TipoLabel {
  imagen = 'imagen',
  titulo = 'titulo',
  subtitulo = 'subtitulo',
  span = 'span',
  icon = 'icon',
  botonVermas = 'vermas',
  botonEditar = 'editar',
  botonesABM = 'abm',
}

export interface DataView {
  label: string; // Es el label que ve el usuario
  field: string; // Key usada para acceder al campo del objeto
  tipoLabel: TipoLabel; // Para determinar en que manera mostrar
}
