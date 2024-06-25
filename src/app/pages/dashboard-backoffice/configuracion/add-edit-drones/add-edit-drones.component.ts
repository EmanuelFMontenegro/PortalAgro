import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Dron } from 'src/app/models/dron.model';
import { DronService } from 'src/app/services/dron.service';
import { DashboardBackOfficeService } from '../../dashboard-backoffice.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-add-edit-drones',
  templateUrl: './add-edit-drones.component.html',
  styleUrls: ['./add-edit-drones.component.sass']
})
export class AddEditDronesComponent {

  constructor(
    private toastr: ToastrService,
    private dronService: DronService,
    private router: Router,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    public dashboardBackOffice: DashboardBackOfficeService)
    {
      this.dashboardBackOffice.dataTitulo.next({ titulo: 'Configuración/Dron' , subTitulo: ''})
    }

  id: any;
  objeto = `Dron`
  titulo = `Detalle ${this.objeto} `
  edicion = false;
  objetoOriginal: Dron = {};
  rutaBase = 'dashboard-backoffice/configuracion'

  // controlNames
  public ctrlName  = 'nickname'
  public ctrlMatricula  = 'matricula'
  public ctrlCode  = 'code'
  public ctrlMarca  = 'brand'
  public ctrlModel  = 'model'
  public ctrlSerie  = 'serie'
  public ctrlPoliza  = 'poliza'
  public ctrlFuncion  = 'function'
  public ctrlDescripcion  = 'description'
  public form: FormGroup = new FormGroup({
    [this.ctrlCode]:  new FormControl(null, Validators.required),
    [this.ctrlName]:  new FormControl(null, Validators.required),
    [this.ctrlMatricula]:  new FormControl(null, Validators.required),
    [this.ctrlMarca]:  new FormControl(null, Validators.required),
    [this.ctrlModel]:  new FormControl(null, Validators.required),
    [this.ctrlSerie]:  new FormControl(null, Validators.required),
    [this.ctrlPoliza]:  new FormControl(null, Validators.required),
    [this. ctrlFuncion]:  new FormControl(null, Validators.required),
    [this.ctrlDescripcion]:  new FormControl(null, Validators.required),
  })

  ngOnInit(): void {
     this.getDetalle()
  }

  getDetalle(){
    this.id = this.activeRoute.snapshot.paramMap.get('id');

    if(this.id){
      this.id = parseInt(this.id)
      this.dronService.get(this.id).subscribe(
        data => {
          this.objetoOriginal = data
          this.form.patchValue(this.objetoOriginal)
          this.form.disable()
        },
        error => {
          console.log(error)
        }
      )
    }else{
      this.titulo = `Nuevo ${this.objeto} `
    }
  }

  habilitarEdicion(){
     this.edicion = true;
     this.titulo = `Editar ${this.objeto} `
     this.form.enable()
  }

  mostrarEditar(){
    return this.id && !this.edicion
  }

  mostrarEliminar(){
    return this.id && this.edicion
  }

  eliminar(){
    this.dronService.delete(this.id).subscribe(
      data =>{
        console.log(data)
        this.toastr.success('Eliminado con éxito', 'Éxito');
        this.router.navigate([this.rutaBase]);
      },
      error =>{
        console.log(error)
      }
    )
  }

  cancelar(){
    if(this.id){
      this.edicion = false;
      this.form.patchValue(this.objetoOriginal)
      this.titulo = `Detalle ${this.objeto} `
    }else{
      this.router.navigate([this.rutaBase]);
    }
  }

  addEdit(){
    if(this.form.valid){
     let body = this.form.getRawValue()

     if(this.id){ // PUT
      this.put(body, this.id)
     }else{ // POST
      this.post(body)
     }

    }else{
      this.toastr.warning(
        'Falntan completar datos requeridos',
        'Atencion'
      );
    }
  }

  post(body: any){
    this.dronService.post(body).subscribe(
      data => {
        console.log(data)
        this.toastr.success('Editado con éxito', 'Éxito');
        this.router.navigate([this.rutaBase]);
      },
      error =>{
        console.log(error)
      }
    )
  }

  put(body: any, id: number){
    this.dronService.put(body, id).subscribe(
      data => {
        console.log(data)
        this.toastr.success('Creado con éxito', 'Éxito');
        this.router.navigate([this.rutaBase]);
      },
      error =>{
        console.log(error)
      }
    )
  }

  confirmarEliminar(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        message: `¿Estás seguro que quieres eliminarlo?`,
        showCancel: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.eliminar()
    });
  }

}
