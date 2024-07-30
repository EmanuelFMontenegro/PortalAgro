import { Component, ViewEncapsulation } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';
import { DashboardBackOfficeService } from '../../dashboard-backoffice/dashboard-backoffice.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../dashboard/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/ApiService';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-servicio',
  templateUrl: './add-edit-servicio.component.html',
  styleUrls: ['./add-edit-servicio.component.scss']
})
export class AddEditServicioComponent {

  constructor(public servicioService: ServiciosService,
    private router: Router,
    private apiService: ApiService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private authService: AuthService,
    public dashboardBackOffice: DashboardBackOfficeService) {
    this.dashboardBackOffice.dataTitulo.next({ titulo: this.edit ? 'Editar servicio' : 'Nuevo servicio', subTitulo: '' })
  }

  // controlNames
  ctrlProductor = 'productor_id';
  ctrlChacra = 'field_id';
  ctrlCultivo = 'typeCrop_id';
  ctrlLote = 'plots';
  ctrlHectareas = 'hectare';
  ctrlConAgua = 'withWater'
  ctrlObservaciones = 'observations';

  backOffice = false;

  public form: FormGroup = new FormGroup({
    [this.ctrlProductor]: new FormControl(null, Validators.required),
    [this.ctrlChacra]: new FormControl(null, Validators.required),
    [this.ctrlCultivo]: new FormControl(null, Validators.required),
    [this.ctrlLote]: new FormControl(null, Validators.required),
    [this.ctrlHectareas]: new FormControl(1),
    [this.ctrlConAgua]: new FormControl(false),
    [this.ctrlObservaciones]: new FormControl(''),
  })
  urlBase = '';
  edit = false;
  lotes: any[] = []
  chacras: any[] = []
  cultivos: any[] = []
  private userId: number | any;

  ngOnInit(): void {
    this.getDatosBasicos()
  }

  getDatosBasicos() {
    this.decodeToken();
    this.getCultivos();

    // si es backoffice debe seleccionar primero el productor para que respete el flujo
    this.backOffice ? this.getProductores(): this.getChacrasProductor()
    this.urlBase =  this.backOffice ? 'dashboard-backoffice' : 'dashboard'
  }

  setUrlBase(){

  }

  getProductores(){

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


  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userId = decoded.userId;
        this.form.controls[this.ctrlProductor].setValue(this.userId)
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    } else {
      this.userId = null;
    }
  }

  seleccionarChacra() {
    let chacraId = this.form.controls[this.ctrlChacra]?.value
    if(chacraId ) this.getLotes()
  }

  seleccionarCultivo() {
    let cultivoId = this.form.controls[this.ctrlCultivo]?.value
    if(cultivoId )  this.form.controls[this.ctrlCultivo].disable()
  }

  solicitarServicio() {
    console.log(this.form.getRawValue())
    let solicitud = this.form.getRawValue();
    if(!this.backOffice){
      this.postServicioByProductor(solicitud)
    }else{
      this.postServicio(solicitud)
    }
  }

  getChacrasProductor() {
    this.apiService.getFields(this.userId).subscribe(
      (response) => {
        if (response.list && response.list.length > 0) {
          this.chacras = response.list[0];
        } else {
          console.error('La lista de campos está vacía o no está definida');
        }
      },
      (error) => {
        console.error('Error al obtener campos:', error);
      }
    );
  }

  getChacras() {
    this.apiService.getUsersFields(0, 10, 'id', 'desc').subscribe(
      (response) => {
        if (response.list && response.list.length > 0) {
          this.chacras = response.list[0];
        } else {
          console.error('La lista de campos está vacía o no está definida');
        }
      },
      (error) => {
        console.error('Error al obtener campos:', error);
      }
    );
  }

  getLotes() {
    let userId = this.form.controls[this.ctrlProductor].value;
    let FieldId = this.form.controls[this.ctrlChacra].value;

    this.apiService.getPlotsOperador(userId, FieldId).subscribe(
      (response: any) => {
        if (response?.list && response.list.length > 0) {
          const lotsArray: any[][] = response.list[0];
          const data: any[] = lotsArray.reduce((acc, curr) => acc.concat(curr), []);
          this.form.controls[this.ctrlChacra].disable()
          this.lotes = data
        } else {
          this.lotes = []
          this.toastr.info('Aún no has agregado ningún lote.', 'Información');
        }
      },
      (error) => {
        console.error('Error al cargar los lotes:', error);
      }
    );
  }

  postServicio(servicio:any) {
    this.servicioService.postServicio(servicio).subscribe(
      data => {
        console.log(data)
      }
    )
  }

  postServicioByProductor(servicio:any) {
    let productorId = servicio.productor_id;
    delete servicio.productor_id
    this.servicioService.postServicioByProductor(servicio,productorId).subscribe(
      data => {
        console.log(data)
      }
    )
  }

  volver() {
    this.router.navigate([this.urlBase + '/servicios']);
  }

  cancelar() {
  }

  limpiarSeleccion() {

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        titulo: 'Limpiar la selección',
        message: `¿Estás seguro que quieres reiniciar la selección?`,
        showCancel: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.form.controls[this.ctrlChacra].setValue(null)
        this.form.controls[this.ctrlChacra].enable()
        this.form.controls[this.ctrlCultivo].setValue(null)
        this.form.controls[this.ctrlCultivo].enable()
        this.form.controls[this.ctrlLote].setValue(null)
        this.form.controls[this.ctrlLote].enable()
      }
    });

  }

}
