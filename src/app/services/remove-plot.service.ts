import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RemovePlotService {
  constructor() {}
  resetPlotData() {
    localStorage.removeItem('plotId');
    localStorage.removeItem('plotData');
    localStorage.removeItem('previousPlantation');
  }
}
