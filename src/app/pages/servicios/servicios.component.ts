import { Component } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice/dashboard-backoffice.service';
import {
  TipoLabel,
  DataView,
} from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { ServiciosService } from 'src/app/services/servicios.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent {
  constructor(
    public serviciosService: ServiciosService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    public dashboardBackOffice: DashboardBackOfficeService
  ) {
    this.dashboardBackOffice.dataTitulo.next({
      titulo: 'Solicitudes y servicios',
      subTitulo: '',
    });
  }
  urlBase = '';
  opcionSeleccionada: any;
  listado: any[] = [];
  dataView: DataView[] = [];
  lotesOriginal: any[] = [];
  cultivos: any[] = [];
  backOffice = false;

  chacras: any[] = []; // ELIMINAR

  ngOnInit(): void {
    this.setUrlVerMas();
    this.backOffice ? this.getServicios() : this.getServiciosByProductor();
  }

  setUrlVerMas() {
    this.getCultivos();
    this.urlBase = this.backOffice ? 'dashboard-backoffice' : 'dashboard';
    this.dataView = [
      { label: 'Estado', field: 'status.name', tipoLabel: TipoLabel.span },
      { label: 'Chacra', field: 'nombreChacra', tipoLabel: TipoLabel.span },
      {
        label: 'Plantación',
        field: 'cropDescripcion',
        tipoLabel: TipoLabel.span,
      },
      { label: 'Lotes', field: 'cantidadLotes', tipoLabel: TipoLabel.span },
      { label: 'Hectarias', field: 'hectare', tipoLabel: TipoLabel.span },
      {
        label: 'Localidad de la chacra',
        field: 'location.name',
        tipoLabel: TipoLabel.span,
      },
      {
        label: 'Tecnico asignado',
        field: 'jobOperator',
        tipoLabel: TipoLabel.span,
      },
      {
        label: 'Contacto técnico',
        field: 'jobTechnical',
        tipoLabel: TipoLabel.span,
      },
      {
        label: 'Piloto asignado',
        field: 'function',
        tipoLabel: TipoLabel.span,
      },
      { label: 'Contacto piloto', field: 'brand', tipoLabel: TipoLabel.span },
      {
        label: 'servicio',
        field: this.urlBase + '/servicios/',
        tipoLabel: TipoLabel.botonVermas,
      },
    ];
  }

  getServiciosByProductor() {
    this.serviciosService
      .getServiciosByProductor()
      .pipe(map((response: any) => this.convertirValores(response.list[0])))
      .subscribe(
        (data: any) => {
          console.log("Datos después de convertirValores:", data); // Verifica la estructura de los datos
          if (data?.length > 0) {
            this.lotesOriginal = data;
            this.listado = data;
            console.log("Listado final:", this.listado); // Verifica cómo se ve el listado antes de mostrarlo
          }
        },
        (error) => {
          console.error('Error al obtener servicios:', error);
        }
      );
  }


  ///// REVISAR SI ELIMINAR  /////////////

  convertirValores(valores: any) {
    console.log('Valores antes de la transformación:', valores);
    if (valores?.length) {
      valores.forEach((lote: any) => {
        lote.cantidadLotes = lote.plots.length;
        lote.cropDescripcion = this.getDescripcionPlantacion(lote.typeCrop.id);
        lote.nombreChacra = this.getDescripcionChacra(lote.field.id); // Asegúrate de usar los IDs correctos
      });
    }
    console.log('Valores después de la transformación:', valores);
    return valores;
  }


  getDescripcionPlantacion(crop_id: number) {
    return this.cultivos.find((cultivo) => cultivo.id == crop_id).name;
  }

  getDescripcionChacra(field_id: number) {
    return this.chacras?.find((chacra) => chacra?.id == field_id)?.name;
  }

  getChacras() {
    return new Promise<any>((resolve) => {
      const decoded: any = jwtDecode(this.authService.getToken() || '');

      this.apiService.getFields(decoded.userId).subscribe(
        (response) => {
          if (response.list && response.list.length > 0) {
            this.chacras = response.list[0];
            resolve(this.chacras);
          } else {
            resolve([]);
            console.error('La lista de campos está vacía o no está definida');
          }
        },
        (error) => {
          console.error('Error al obtener campos:', error);
          resolve([]);
        }
      );
    });
  }

  /////////////////////////////////

  getServicios() {
    this.serviciosService.getServicios().subscribe(
      (data) => {
        console.log(data);
        if (data?.list[0].length > 0) {
          this.lotesOriginal = data?.list[0];
          this.listado = data?.list[0];
        }
      },
      (error) => {}
    );
  }

  filtrar() {
    if (!this.opcionSeleccionada) {
      this.toastr.info('Selecione un tipo de cultivo.', 'Información');
    } else {
      let crop_id: number = this.opcionSeleccionada;
      this.listado = this.lotesOriginal.filter((x) => x.typeCrop_id == crop_id);
    }
  }

  nuevo() {
    this.router.navigate([this.urlBase + '/servicios/nuevo']);
  }

  getCultivos() {
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
}
