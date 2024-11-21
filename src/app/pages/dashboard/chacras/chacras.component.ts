import { Component, OnInit, Output } from '@angular/core'; 
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router'; 
import { FilterConfig, ButtonConfig } from 'src/app/models/searchbar.model';
import { TipoLabel, DataView } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { selectButtons, selectFilters } from 'src/app/shared/components/dinamic-searchbar/dinamic-searchbar.config';
export type FilterInputType = 'text' | 'select' | 'double-number' | 'select-options';
@Component({
  selector: 'app-chacras',
  templateUrl: './chacras.component.html',
})
export class ChacrasComponent implements OnInit {
  @Output() mensaje = 'No Existen este filtro'; 
  userLogeed = this.authService.userLogeed;
  currentYear: number = new Date().getFullYear();
  filterConfigs: FilterConfig[] = [];
  buttonConfigs: ButtonConfig[] = [];
  localidades: any[] = [];
  campos: any[] = [];
  camposTemplate: any[] = [];
  dataView: DataView[] = [
    {
      label: '',
      field: 'assets/img/Chacra_1.png',
      tipoLabel: TipoLabel.imagen,
    },
    { label: '', field: 'name', tipoLabel: TipoLabel.titulo },
    {
      label: 'Localidad',
      field: 'address.location.name',
      tipoLabel: TipoLabel.span,
    },
    { label: 'Hectarias', field: 'dimensions', tipoLabel: TipoLabel.span },
    { label: 'Descripción', field: 'observation', tipoLabel: TipoLabel.span },
    {
      label: 'campoSeleccionado',
      field: 'dashboard/lote',
      tipoLabel: TipoLabel.botonVerLote,
    },
    {
      label: 'campoSeleccionado',
      field: 'dashboard/detalle-campo',
      tipoLabel: TipoLabel.botonGeo,
    },
  ];
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    //aca pasamos los filtros y los botones, para que el componente dinamico los renderice
    // selectFilters y selectButton buscan esos filtros y los devuelven en un array
    this.filterConfigs = selectFilters([
      'LOCALIDAD',
      'NOMBRE_CHACRA',
      'HECTAREAS' // este es para mostrarte como seria un ejemplo sin input, borra nomas despues
    ]);

    this.buttonConfigs = selectButtons([
      'REGISTRAR_CHACRAS', 
    ]);
    this.cargarCampos();
    this.obtenerLocalidades();
  }

  newRanch() {
    this.router.navigate(['/dashboard/campo']);
  }

  BtnRegisterCampos(): void {
    this.router.navigate(['/dashboard/campo']);
  }

  cargarCampos() {
    if (!this.userLogeed?.userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    this.apiService.getFields(this.userLogeed?.userId).subscribe(
      (response) => {
        if (response.list && response.list.length > 0) {
          this.campos = response.list[0];
          this.camposTemplate = this.campos;
        } else {
          console.error('La lista de campos está vacía o no está definida');
        }
      },
      (error) => {
        console.error('Error al obtener campos:', error);
      }
    );
  } 

  
  obtenerLocalidades() {
    this.apiService.getLocationMisiones('location').subscribe(
      (localidades) => {
        this.localidades = localidades;

      },
      (error) => {
        console.error('Error al obtener las localidades', error);
      }
    );
  }
 
  volver() {
    this.router.navigate(['dashboard/inicio']);
  }
  verLotes(campo: any): void {
    localStorage.setItem(
      'campoSeleccionado',
      JSON.stringify(campo)
    );
    this.router.navigate(['dashboard/lote']);
  }
/* Ver si es necesario consultar a la api, sino podemos reasignar this.camposTemplate con this.campos */
  clearFilter() {
    this.cargarCampos();
  }

  onFilter(filtro: any) { 
    const filterHandlers: { [key: string]: (value: any) => void } = {
      'Buscar por Localidad': (value) => this.filtrarPorLocalidad(value),
      'Buscar por Nombre de Chacra': (value) => this.filtrarPorNombreDeChacra(value),
      'Buscar por Hectáreas': (value) => this.filtrarPorHectareas(filtro.min, filtro.max), 
    };
    const handler = filterHandlers[filtro.type];
    
    if (handler) {
      handler(filtro.value);
    } else {
      console.warn(`No se encontró un manejador para el filtro tipo: ${filtro.type}`);
    }
  }

  filtrarPorHectareas(min: number, max: number) {
    if (min == null || max == null) {
      this.toastr.error('Debe ingresar un valor mínimo y máximo de hectáreas', 'Error');
      return;
    }
    if (min > max) {
      this.toastr.error('El valor mínimo no puede ser mayor al valor máximo', 'Error');
      return;
    }
    const camposFiltrados = this.campos.filter(
      (campo) => campo.dimensions >= min && campo.dimensions <= max
    );
    if (camposFiltrados.length > 0) {
      this.camposTemplate = camposFiltrados;
    } else {
      this.toastr.info(
        'No se encontraron chacras con las hectáreas ingresadas',
        'Información'
      );
      this.camposTemplate = this.campos;
    }

  }

  filtrarPorLocalidad(buscar: string) { 
    if (!buscar || typeof buscar !== 'string') {
      this.toastr.error('Debe seleccionar una localidad', 'Error');
      return;
    }
    const buscarNormalizado = buscar.trim().toLowerCase();
    if (!this.localidades || this.localidades.length === 0) {
      this.toastr.error('No hay localidades disponibles para buscar', 'Error');
      return;
    }
    const localidadSeleccionada = this.localidades.find(
      (loc) => loc.name && loc.name.trim().toLowerCase() === buscarNormalizado
    );
    if (!localidadSeleccionada) {
      this.toastr.error('Localidad no encontrada', 'Error');
      return;
    }
    const locationId = localidadSeleccionada.id;
    const camposFiltrados = this.campos.filter(
      (campo) =>
        campo.address &&
        campo.address.location &&
        campo.address.location.id === locationId
    );
    if (camposFiltrados.length > 0) {

      this.camposTemplate = camposFiltrados;
    } else {
      this.toastr.info(
        'No se encontraron chacras con la localidad seleccionada',
        'Información'
      );
      this.camposTemplate = this.campos;
    }
  }

  filtrarPorNombreDeChacra(nombreChacra: string) { 
    if (!nombreChacra || nombreChacra.trim() === '') {
      this.toastr.error('Debe ingresar un nombre de chacra', 'Error');
      return;
    }
    const palabrasClave = nombreChacra.trim().toLowerCase().split(/\s+/);

    if (!this.campos || this.campos.length === 0) {
      this.toastr.error('No hay chacras disponibles para buscar', 'Error');
      return;
    }
    const camposFiltrados = this.campos.filter((campo) => {
      const campoNombre = campo.name?.trim().toLowerCase();
      return palabrasClave.every((palabra) => campoNombre.includes(palabra));
    });
    if (camposFiltrados.length > 0) {
      
      this.camposTemplate = camposFiltrados;
    } else {
      this.toastr.info(
        'No se encontraron chacras con el nombre ingresado',
        'Información'
      );
      this.camposTemplate = this.campos;
    }
  }

  clearCampos() {
      this.clearFilter();
  }
}
