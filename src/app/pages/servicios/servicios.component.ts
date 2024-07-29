import { Component } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice/dashboard-backoffice.service';
import { TipoLabel,DataView } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { ServiciosService } from 'src/app/services/servicios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent {

  constructor(
    public serviciosService: ServiciosService,
    private router: Router,
    public dashboardBackOffice: DashboardBackOfficeService)
    {
      this.dashboardBackOffice.dataTitulo.next({ titulo: 'Solicitudes y servicios' , subTitulo: ''})
    }
    urlBase = ''
    opcionSeleccionada: any
    listado: any [] = []
    dataView: DataView [] = []

    backOffice = false;

    ngOnInit(): void {
      this.setUrlVerMas();
      this.backOffice ? this.getServicios() : this.getServiciosByProductor()
    }

    setUrlVerMas(){
      this.urlBase = this.backOffice ? 'dashboard-backoffice' :  'dashboard'
      this.dataView = [
        {label: 'Estado', field: 'nickname', tipoLabel: TipoLabel.span},
        {label: 'Chacra', field:'function', tipoLabel: TipoLabel.span },
        {label: 'Plantación', field:'brand', tipoLabel: TipoLabel.span },
        {label: 'Lotes', field: 'model', tipoLabel: TipoLabel.span},
        {label: 'Chacra', field:'function', tipoLabel: TipoLabel.span },
        {label: 'Hectarias', field:'brand', tipoLabel: TipoLabel.span },
        {label: 'Localidad de la chacra', field: 'model', tipoLabel: TipoLabel.span},
        {label: 'Tecnico asignado', field:'function', tipoLabel: TipoLabel.span },
        {label: 'Contacto técnico', field:'brand', tipoLabel: TipoLabel.span },
        {label: 'Piloto asingnado', field:'function', tipoLabel: TipoLabel.span },
        {label: 'Contacto piloto', field:'brand', tipoLabel: TipoLabel.span },
        {label: 'Ver mas', field: this.urlBase +'/servicios/', tipoLabel: TipoLabel.botonVermas},
      ]
    }

    getServiciosByProductor(){
      let productorId = 7
      this.serviciosService.getServiciosByProductor().subscribe(
        data =>{
          console.log(data)
          if(data?.list[0].length > 0) this.listado = data?.list[0]
        },
        error =>{}
      )
  }


    getServicios(){
        this.serviciosService.getServicios().subscribe(
          data =>{
            console.log(data)
            if(data?.list[0].length > 0) this.listado = data?.list[0]
          },
          error =>{}
        )
    }

    nuevo(){
      this.router.navigate([this.urlBase + '/servicios/nuevo']);
    }

    cambiarConfig(event:any){

    }






}
