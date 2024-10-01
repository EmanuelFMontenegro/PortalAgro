import { Component, ViewEncapsulation } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice/dashboard-backoffice.service';
import {
  TipoLabel,
  DataView,
} from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { ServiciosService } from 'src/app/services/servicios.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { map, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { ServicioInterno } from './servicios-interno.service';
import { PermisosUsuario } from 'src/app/models/permisos.model';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ServiciosComponent {
  constructor(
    public serviciosService: ServiciosService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private servicioInterno: ServicioInterno,
    public dashboardBackOffice: DashboardBackOfficeService
  ) {
    this.dashboardBackOffice.dataTitulo.next({
      titulo: 'Solicitudes y servicios',
      subTitulo: '',
    });
    this.servicioInterno.comprobarUrlBackOffice()
  }
  urlBase = '';
  opcionSeleccionada: any;
  listado: any[] = [];
  dataView: DataView[] = [];
  lotesOriginal: any[] = [];
  cultivos: any[] = [];
  backOffice = false;
  subscription = new Subscription()
  crearServicio = false;

  chacras: any[] = []; // ELIMINAR

  ngOnInit(): void {
    this.isBackOffice()
    this.setUrlVerMas();
    this.backOffice ? this.getServicios() : this.getServiciosByProductor();
    this.getUserConPermisos()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  async getUserConPermisos(){
    await this.authService.getUserWithPermisos()
    this.crearServicio = this.authService.userWithPermissions?.value?.permisos.requestservice.CREATE
  }

  isBackOffice(){
    this.subscription.add(
      this.servicioInterno.backOffice$.subscribe(
        (value: boolean) => this.backOffice = value
      )
    )
  }

  setUrlVerMas() {
    this.getCultivos();
    this.urlBase = this.backOffice ? 'dashboard-backoffice' : 'dashboard';
    this.dataView = [
      { label: 'Estado', field: 'status.name', tipoLabel: TipoLabel.span },
      {
        label: 'Solicitado',
        field: 'dateOfService',
        tipoLabel: TipoLabel.span,
      },
      { label: 'Chacra', field: 'field.name', tipoLabel: TipoLabel.span },
      { label: 'PLantación', field: 'typeCrop.name', tipoLabel: TipoLabel.span },
      { label: 'Hectáreas', field: 'hectare', tipoLabel: TipoLabel.span },
      {
        label: 'Localidad',
        field: 'location.name',
        tipoLabel: TipoLabel.span,
      },
      {
        label: 'Tecnico',
        field: 'jobTechnical.employee.name',
        tipoLabel: TipoLabel.span,
      },
      {
        label: 'Piloto',
        field: 'jobOperator.employee.name',
        tipoLabel: TipoLabel.span,
      },
      {
        label: 'servicio',
        field: this.urlBase + '/servicios/',
        tipoLabel: TipoLabel.botonVermas,
      },
    ];

    if(this.backOffice) this.dataView.splice(3, 0,  { label: 'Productor',  field: 'producer.lastname',  tipoLabel: TipoLabel.span});
  }

  getServiciosByProductor() {
    this.serviciosService
      .getServiciosByProductor()
      .pipe(map((response: any) => this.convertirValores(response.list[0])))
      .subscribe(
        (data: any) => {
          if (data?.length > 0) {
            this.lotesOriginal = data;
            this.listado = data;
          }
        },
        (error) => {
          console.error('Error al obtener servicios:', error);
        }
      );
  }


  ///// REVISAR SI ELIMINAR  /////////////

  convertirValores(valores: any) {
    if (valores?.length) {
      valores.forEach((lote: any) => {
        lote.cantidadLotes = lote.plots.length;
        lote.cropDescripcion = this.getDescripcionPlantacion(lote.typeCrop.id);
        lote.nombreChacra = this.getDescripcionChacra(lote.field.id); // Asegúrate de usar los IDs correctos
      });
    }
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
      this.listado = this.lotesOriginal.filter((x) => x.typeCrop.id== crop_id);
    }
  }

  limpiarSeleccion(){
    this.listado = this.lotesOriginal;
    setTimeout(() => {
      this.opcionSeleccionada = null;
    }, 50);
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
