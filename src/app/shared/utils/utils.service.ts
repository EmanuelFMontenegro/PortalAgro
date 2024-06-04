import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

obtenerValor(objeto: any, ruta: string) {
  return ruta.split('.').reduce((acc, clave) => acc && acc[clave], objeto);
}

}
