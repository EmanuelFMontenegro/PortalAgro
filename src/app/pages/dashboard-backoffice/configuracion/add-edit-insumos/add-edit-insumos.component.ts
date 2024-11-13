import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Insumo } from 'src/app/models/insumo.model';
import { InsumoService } from 'src/app/services/insumo.service';
import { DashboardBackOfficeService } from '../../dashboard-backoffice.service';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-add-edit-insumos',
  templateUrl: './add-edit-insumos.component.html',
  styleUrls: ['./add-edit-insumos.component.sass'],
})
export class AddEditInsumosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  id: any;
  objeto = `Insumo`;
  titulo = `Detalle ${this.objeto} `;
  edicion = false;
  objetoOriginal: Insumo = {};
  rutaBase = 'dashboard-backoffice/configuracion';

  // controlNames
  readonly ctrlName = 'name';
  readonly ctrlFormato = 'formato';
  readonly ctrlCode = 'code';
  readonly ctrlDescripcion = 'description';

  public form: FormGroup = new FormGroup({
    [this.ctrlCode]: new FormControl(null, Validators.required),
    [this.ctrlName]: new FormControl(null, Validators.required),
    [this.ctrlFormato]: new FormControl(null, Validators.required),
    [this.ctrlDescripcion]: new FormControl(null, Validators.required),
  });

  constructor(
    private toastr: ToastrService,
    private insumoService: InsumoService,
    private router: Router,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    public dashboardBackOffice: DashboardBackOfficeService
  ) {
    this.dashboardBackOffice.dataTitulo.next({
      titulo: 'Configuración/Insumo',
      subTitulo: '',
    });
  }

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
      this.insumoService.get(this.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.objetoOriginal = data;
            this.form.patchValue(this.objetoOriginal);
            this.form.disable();
          },
          error: (error) => {
            console.error('Error al obtener detalle:', error);
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
  }

  mostrarEditar() {
    const shouldShowEdit = this.id && !this.edicion;
    if (shouldShowEdit && !this.form.disabled) {
      this.form.disable();
    }
    return shouldShowEdit;
  }

  mostrarEliminar() {
    return this.id && this.edicion;
  }

  eliminar() {
    this.insumoService.delete(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('Eliminado con éxito', 'Éxito');
          this.router.navigate([this.rutaBase]);
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          this.toastr.error('Error al eliminar el insumo', 'Error');
        }
      });
  }

  cancelar() {
    if (this.id) {
      this.edicion = false;
      this.form.patchValue(this.objetoOriginal);
      this.form.disable();
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.titulo = `Detalle ${this.objeto} `;
    } else {
      this.router.navigate([this.rutaBase]);
    }
  }

  addEdit() {
    if (this.form.valid) {
      const body = this.form.getRawValue();
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
    this.insumoService.post(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('Creado con éxito', 'Éxito');
          this.router.navigate([this.rutaBase]);
        },
        error: (error) => {
          console.error('Error al crear:', error);
          this.toastr.error('Error al crear el insumo', 'Error');
        }
      });
  }

  put(body: any, id: number) {
    this.insumoService.put(body, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('Editado con éxito', 'Éxito');
          this.router.navigate([this.rutaBase]);
        },
        error: (error) => {
          console.error('Error al editar:', error);
          this.toastr.error('Error al editar el insumo', 'Error');
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