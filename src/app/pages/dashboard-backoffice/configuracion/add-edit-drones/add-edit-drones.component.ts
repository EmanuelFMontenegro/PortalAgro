import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Dron } from 'src/app/models/dron.model';
import { DronService } from 'src/app/services/dron.service';
import { PermisoService } from 'src/app/services/permisos.service';
import { DashboardBackOfficeService } from '../../dashboard-backoffice.service';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-edit-drones',
  templateUrl: './add-edit-drones.component.html',
})
export class AddEditDronesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(
    private toastr: ToastrService,
    private dronService: DronService,
    private router: Router,
    public permisoService: PermisoService,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    public dashboardBackOffice: DashboardBackOfficeService
  ) {
    this.dashboardBackOffice.dataTitulo.next({
      titulo: 'Configuración/Dron',
      subTitulo: '',
    });
  }

  id: any;
  objeto = `Dron`;
  titulo = `Detalle ${this.objeto} `;
  edicion = false;
  objetoOriginal: Dron = {};
  rutaBase = 'dashboard-backoffice/configuracion';

  // controlNames
  public ctrlName = 'nickname';
  public ctrlMatricula = 'matricula';
  public ctrlCode = 'code';
  public ctrlMarca = 'brand';
  public ctrlModel = 'model';
  public ctrlSerie = 'serie';
  public ctrlPoliza = 'poliza';
  public ctrlFuncion = 'function';
  public ctrlDescripcion = 'description';
  public ctrInitialFlightTime = 'initialFlightTime';
  public form: FormGroup = new FormGroup({
    [this.ctrlCode]: new FormControl(null, Validators.required),
    [this.ctrlName]: new FormControl(null, Validators.required),
    [this.ctrlMatricula]: new FormControl(null, Validators.required),
    [this.ctrlMarca]: new FormControl(null, Validators.required),
    [this.ctrlModel]: new FormControl(null, Validators.required),
    [this.ctrlSerie]: new FormControl(null, Validators.required),
    [this.ctrlPoliza]: new FormControl(null, Validators.required),
    [this.ctrlFuncion]: new FormControl(null, Validators.required),
    [this.ctrlDescripcion]: new FormControl(null, Validators.required),
    [this.ctrInitialFlightTime]: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {
    this.getDetalle();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDetalle() {
    this.id = this.activeRoute.snapshot.paramMap.get('id');

    if (this.id) {
      this.id = parseInt(this.id);
      this.dronService.get(this.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.objetoOriginal = data;
            this.form.patchValue(this.objetoOriginal);
            this.form.disable();
          },
          error: (error) => {
            console.log(error);
            this.toastr.error('Error al cargar los datos', 'Error');
          }
        });
    } else {
      this.titulo = `Nuevo ${this.objeto} `;
    }
  }

  habilitarEdicion() {
    this.edicion = true;
    this.titulo = `Editar ${this.objeto} `;
    this.form.enable();
    console.log('Form status after enable:', this.form.valid); 
  }

  mostrarEditar() {
    return this.id && !this.edicion;
  }

  mostrarEliminar() {
    return this.id && this.edicion;
  }

  eliminar() {
    this.dronService.delete(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('Eliminado con éxito', 'Éxito');
          this.router.navigate([this.rutaBase]);
        },
        error: (error) => {
          console.log(error);
          this.toastr.error('Error al eliminar', 'Error');
        }
      });
  }

  cancelar() {
    if (this.id) {
      this.edicion = false;
      this.form.patchValue(this.objetoOriginal);
      this.form.disable(); 
      this.titulo = `Detalle ${this.objeto} `;
    } else {
      this.router.navigate([this.rutaBase]);
    }
  }

  addEdit() {
    if (this.form.valid) {
      let body = this.form.getRawValue();

      if (this.id) {
        this.put(body, this.id);
      } else {
        this.post(body);
      }
    } else {
      this.form.markAllAsTouched();
      this.toastr.warning('Faltan completar datos requeridos', 'Atención');
    }
  }

  post(body: any) {
    this.dronService.post(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('Creado con éxito', 'Éxito');
          this.router.navigate([this.rutaBase]);
        },
        error: (error) => {
          console.log(error);
          this.toastr.error('Error al crear', 'Error');
        }
      });
  }

  put(body: any, id: number) {
    this.dronService.put(body, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('Editado con éxito', 'Éxito');
          this.router.navigate([this.rutaBase]);
        },
        error: (error) => {
          console.log(error);
          this.toastr.error('Error al editar', 'Error');
        }
      });
  }


  confirmarEliminar(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        message: `¿Estás seguro que quieres eliminarlo?`,
        showCancel: true,
      },
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) this.eliminar();
      });
  }
}
