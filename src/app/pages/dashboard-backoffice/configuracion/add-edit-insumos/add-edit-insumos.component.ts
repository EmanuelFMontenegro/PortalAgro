import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Insumo } from 'src/app/models/insumo.model';
import { InsumoService } from 'src/app/services/insumo.service';
import { DashboardBackOfficeService } from '../../dashboard-backoffice.service';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-add-edit-insumos',
  templateUrl: './add-edit-insumos.component.html',
  styleUrls: ['./add-edit-insumos.component.sass'],
})
export class AddEditInsumosComponent {
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

  id: any;
  objeto = `Insumo`;
  titulo = `Detalle ${this.objeto} `;
  edicion = false;
  objetoOriginal: Insumo = {};
  rutaBase = 'dashboard-backoffice/configuracion';

  // controlNames
  public ctrlName = 'name';
  public ctrlFormato = 'formato';
  public ctrlCode = 'code';
  public ctrlDescripcion = 'description';

  public form: FormGroup = new FormGroup({
    [this.ctrlCode]: new FormControl(null, Validators.required),
    [this.ctrlName]: new FormControl(null, Validators.required),
    [this.ctrlFormato]: new FormControl(null, Validators.required),
    [this.ctrlDescripcion]: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {
    this.getDetalle();
  }

  getDetalle() {
    this.id = this.activeRoute.snapshot.paramMap.get('id');

    if (this.id) {
      this.id = parseInt(this.id);
      this.insumoService.get(this.id).subscribe(
        (data) => {
          this.objetoOriginal = data;
          this.form.patchValue(this.objetoOriginal);
          this.form.disable();
        },
        (error) => {
          console.log(error);
        }
      );
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
    return this.id && !this.edicion;
  }

  mostrarEliminar() {
    return this.id && this.edicion;
  }

  eliminar() {
    this.insumoService.delete(this.id).subscribe(
      (data) => {
        console.log(data);
        this.toastr.success('Eliminado con éxito', 'Éxito');
        this.router.navigate([this.rutaBase]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  cancelar() {
    if (this.id) {
      this.edicion = false;
      this.form.patchValue(this.objetoOriginal);
      this.titulo = `Detalle ${this.objeto} `;
    } else {
      this.router.navigate([this.rutaBase]);
    }
  }

  addEdit() {
    if (this.form.valid) {
      let body = this.form.getRawValue();

      if (this.id) {
        // PUT
        this.put(body, this.id);
      } else {
        // POST
        this.post(body);
      }
    } else {
      this.form.markAllAsTouched();
      this.toastr.warning('Falntan completar datos requeridos', 'Atencion');
    }
  }

  post(body: any) {
    this.insumoService.post(body).subscribe(
      (data) => {
        console.log(data);
        this.toastr.success('Editado con éxito', 'Éxito');
        this.router.navigate([this.rutaBase]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  put(body: any, id: number) {
    this.insumoService.put(body, id).subscribe(
      (data) => {
        console.log(data);
        this.toastr.success('Creado con éxito', 'Éxito');
        this.router.navigate([this.rutaBase]);
      },
      (error) => {
        console.log(error);
      }
    );
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
      if (result) this.eliminar();
    });
  }
}
