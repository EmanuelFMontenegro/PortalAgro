import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/pages/dashboard/dialog/dialog.component';
import {
  TipoLabel,
  DataView,
} from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { selectButtons, selectFilters } from 'src/app/shared/components/dinamic-searchbar/dinamic-searchbar.config';
import { ButtonConfig, FilterConfig } from 'src/app/models/searchbar.model';
interface Lote {
  id: number;
  name: string;
  descriptions: string;
  dimensions: number;
  typeCrop: {
    id: number;
    name: string;
  };
  url_profile: string | null;
  plant_name?: string;
  type_crop_id?: number;
}

 
@Component({
  selector: 'app-chacras-lote',
  templateUrl: './chacras-lote.component.html',
})
export class ChacrasLoteComponent {
  @Output() chacraSeleccionadoCambio = new EventEmitter<any>(); 
  cultivos: any[] = []; 
  locationId: number | null = null;  
  FieldId: number = 0; 
  loteData: Lote[] = [];
  loteTemplate : Lote[] = [];  
  private userId: number = 0;
  dataView: DataView[] = [
    { label: '', field: 'assets/img/Chacra_1.png', tipoLabel: TipoLabel.imagen },
    { label: 'Nombre del Lote', field: 'name', tipoLabel: TipoLabel.span },
    { label: 'Plantación', field: 'plant_name', tipoLabel: TipoLabel.span },
    { label: 'Hectáreas', field: 'dimensions', tipoLabel: TipoLabel.span },
    { label: 'Descripción', field: 'descriptions', tipoLabel: TipoLabel.span },
    {
      label: 'previousPlantation',
      field: 'dashboard-backoffice/cargar-lotes',
      tipoLabel: TipoLabel.botonEditarDevolverObjeto,
    },
    {
      label: '',
      field: '',
      tipoLabel: TipoLabel.botonEliminar,
    }
  ];
  filterConfigs: FilterConfig[] = [];
  buttonConfigs: ButtonConfig[] = [];

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const chacraSeleccionadaString = localStorage.getItem('chacraSeleccionada');
    if (chacraSeleccionadaString !== null) {
      const chacraSeleccionada = JSON.parse(chacraSeleccionadaString);
      this.FieldId = chacraSeleccionada.id;
      this.userId = chacraSeleccionada.person_id;
    } else {
      console.error(
        'No se encontró la chacra seleccionada en el localStorage.'
      );
    } 
    this.obtenerCultivos()
    this.loadDataLote(this.FieldId, this.userId);
    this.filterConfigs = selectFilters([
      'CULTIVO',
      'HECTAREAS'
       ]);

    this.buttonConfigs = selectButtons([
      'NUEVO_LOTE_P', 
    ]);
  }

 
 
  obtenerCultivos() {
    this.apiService.getAllTypeCropOperador().subscribe(
      (typeCrops: any) => {
        this.cultivos = typeCrops.map((crop: any) => ({
          id: crop.id,
          name: crop.name,
        })); 
      },
      (error) => {
        console.error('Error al cargar los tipos de cultivo:', error);
      }
    );
  }
 
  confirmarBorrado(lote: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        message: `¿Estás seguro que quieres eliminar el ${lote.name}?`,
        value: lote,
        showCancel: true,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService
          .deleteLogicalPlotOperador(this.userId, this.FieldId, lote.id)
          .subscribe(
            () => {
              this.toastr.success('El Lote ha sido borrado con éxito', 'Éxito');
              this.loteData = this.loteData.filter(
                (item) => item.id !== lote.id
              );
              this.loteTemplate = [...this.loteData];
            },
            (error) => {
              this.toastr.error('Error al borrar el lote', 'Error');
            }
          );
      }
    });
  }

  loadDataLote(FieldId: number, userId: number): void { 
     if (userId && FieldId) {
      this.apiService.getPlotsOperador(userId, FieldId).subscribe(
        (response: any) => {
          if (response?.list && response.list.length > 0) {
            const lotsArray: Lote[][] = response.list[0];
            const data: Lote[] = lotsArray.reduce(
              (acc, curr) => acc.concat(curr),
              []
            );
            if (data.length > 0) {
              this.apiService.getAllTypeCropOperador().subscribe(
                (typeCrops: any) => {
                  const typeCropsMap = typeCrops.reduce(
                    (acc: any, curr: any) => {
                      acc[curr.id] = curr.name;
                      return acc;
                    },
                    {}
                  );
                  data.forEach((lote: Lote) => {
                    lote.plant_name = lote.typeCrop ? lote.typeCrop.name : '';
                  });

                  this.loteData = data;
                  this.loteTemplate = [...this.loteData];
                },
                (error) => {
                  console.error('Error al cargar los tipos de cultivo:', error);
                }
              );
            } else {
              this.toastr.info(
                'Aún no has agregado ningún lote.',
                'Información'
              );
            }
          } else {
            this.toastr.info('Aún no has agregado ningún lote.', 'Información');
          }
        },
        (error) => {
          console.error('Error al cargar los lotes:', error);
        }
      );
    } else {
      console.warn(
        'El userId o el FieldId son null o undefined, por lo que no se cargan los lotes.'
      );
    }
  }

  editarLote(lote: Lote): void {
    localStorage.setItem('plotId', lote.id.toString());
    localStorage.setItem('plotData', JSON.stringify(lote));
    localStorage.setItem('previousPlantation', lote.typeCrop.name);
    this.router.navigate(['dashboard-backoffice/cargar-lotes']);
  }

 
  clearFilter() {
     this.loteTemplate = [... this.loteData]
  }

  onFilter(filtro: any) { 
    const filterHandlers: { [key: string]: (value: any) => void } = {
      'Buscar por Cultivo': (value) => this.filtrarPorCultivo(value),
      'Buscar por Hectáreas': (value) => this.aplicarFiltroHectareas(filtro.min,filtro.max), 
    };
    const handler = filterHandlers[filtro.type];
    
    if (handler) {
      handler(filtro.value);
    } else {
      console.warn(`No se encontró un manejador para el filtro tipo: ${filtro.type}`);
    }
  }
 
  filtrarPorCultivo(cropId: number | undefined = undefined) {   
    if (cropId) {
      this.loteTemplate = this.loteData.filter( (lote) => {
      return (lote.typeCrop.id === cropId)
    }); 
    this.loteTemplate ? this.toastr.info('No se encontraron lotes para el cultivo buscado.', 'Información') : this.loteTemplate = [];
    }
  }


  aplicarFiltroHectareas(minHectareas: number, maxHectareas: number) {
   if (!minHectareas || !maxHectareas) {
      this.toastr.warning(
        'Por favor ingresa los valores mínimo y máximo de hectáreas.',
        'Advertencia'
      );
      return;
    }
    this.loteTemplate = this.loteData.filter( (lote) => {
      return (lote.dimensions >= minHectareas && lote.dimensions <= maxHectareas)
    });
    this.loteTemplate ? this.toastr.info('No se encontraron lotes dentro del rango de hectáreas especificado.', 'Información') : this.loteTemplate = [];
  }
}
