import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

obtenerValor(objeto: any, ruta: string) {
  if (!ruta) {
    return null;
  }

  const keys = ruta.split('.');
  let value = objeto;

  if(keys){
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return null;
      }
    }
  }else{
    value[ruta]
  }

  return value;
}
}


