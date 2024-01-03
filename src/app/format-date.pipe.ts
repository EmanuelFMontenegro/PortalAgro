import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(date: Date | null): string {
    if (!date) {
      return '';
    }

    const day = date.getDate();
    const month = date.getMonth() + 1; // Sumamos 1 ya que los meses comienzan desde 0
    const year = date.getFullYear();

    // Ajustar el orden de día y mes para el formato "mm/dd/yyyy"
    const dayFormatted = day < 10 ? `0${day}` : day.toString();
    const monthFormatted = month < 10 ? `0${month}` : month.toString();

    return `${monthFormatted}/${dayFormatted}/${year}`;
  }
}
