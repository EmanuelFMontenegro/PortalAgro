import { Component } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice/dashboard-backoffice.service';
import { TipoLabel,DataView } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { ServiciosService } from 'src/app/services/servicios.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent {

  constructor(
    public serviciosService: ServiciosService,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    public dashboardBackOffice: DashboardBackOfficeService)
    {
      this.dashboardBackOffice.dataTitulo.next({ titulo: 'Solicitudes y servicios' , subTitulo: ''})
    }
    urlBase = ''
    opcionSeleccionada: any
    listado: any [] = []
    dataView: DataView [] = []
    lotesOriginal: any [] = []
    cultivos: any [] = []
    backOffice = false;

    ngOnInit(): void {
      this.setUrlVerMas();
      this.getCultivos();
      this.backOffice ? this.getServicios() : this.getServiciosByProductor()
    }

    setUrlVerMas(){
      this.urlBase = this.backOffice ? 'dashboard-backoffice' :  'dashboard'
      this.dataView = [
        {label: 'Estado', field: 'status.description', tipoLabel: TipoLabel.span},
        {label: 'Chacra', field:'field_id', tipoLabel: TipoLabel.span },
        {label: 'Plantación', field:'typeCrop_id', tipoLabel: TipoLabel.span },
        {label: 'Lotes', field: 'plots', tipoLabel: TipoLabel.span},
        {label: 'Hectarias', field:'hectare', tipoLabel: TipoLabel.span },
        {label: 'Localidad de la chacra', field: 'location.name', tipoLabel: TipoLabel.span},
        {label: 'Tecnico asignado', field:'jobOperator', tipoLabel: TipoLabel.span },
        {label: 'Contacto técnico', field:'jobTechnical', tipoLabel: TipoLabel.span },
        {label: 'Piloto asignado', field:'function', tipoLabel: TipoLabel.span },
        {label: 'Contacto piloto', field:'brand', tipoLabel: TipoLabel.span },
        {label: 'Ver mas', field: this.urlBase +'/servicios/', tipoLabel: TipoLabel.botonVermas},
      ]
    }

    getServiciosByProductor(){
      let productorId = 7
      this.serviciosService.getServiciosByProductor().subscribe(
        data =>{
          console.log(data)
          if(data?.list[0].length > 0) {
            this.lotesOriginal = data?.list[0]
            this.listado = data?.list[0]
          }
        },
        error =>{}
      )
  }


    getServicios(){
        this.serviciosService.getServicios().subscribe(
          data =>{
            console.log(data)
            if(data?.list[0].length > 0) {
              this.lotesOriginal = data?.list[0]
              this.listado = data?.list[0]
            }
          },
          error =>{}
        )
    }

    filtrar(){
      if(!this.opcionSeleccionada){
        this.toastr.info('Selecione un tipo de cultivo.', 'Información');
      }else{
        let crop_id:number = this.opcionSeleccionada
        this.listado = this.lotesOriginal.filter(x => x.typeCrop_id == crop_id)
      }
    }

    nuevo(){
      this.router.navigate([this.urlBase + '/servicios/nuevo']);
    }

    getCultivos(){
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
