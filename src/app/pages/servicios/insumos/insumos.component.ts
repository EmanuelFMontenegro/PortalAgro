import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Insumo } from 'src/app/models/insumo.model';
import { InsumoService } from 'src/app/services/insumo.service';
import { DashboardBackOfficeService } from '../../dashboard-backoffice/dashboard-backoffice.service';
import { ServicioInterno } from '../servicios-interno.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-insumos',
  templateUrl: './insumos.component.html',
  styleUrls: ['./insumos.component.sass']
})
export class InsumosComponent {


  constructor(
    private toastr: ToastrService,
    private insumoService: InsumoService,
    private router: Router,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private location: Location,
    private servicioInterno : ServicioInterno,
    public dashboardBackOffice: DashboardBackOfficeService
  ) {

  }
  backOffice: any;
  id: any;
  objeto = `Insumo`;
  titulo = `Detalle ${this.objeto} `;
  edicion = false;
  objetoOriginal: Insumo = {};

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
    let insumo = sessionStorage.getItem('insumo') ?? ''
    this.objetoOriginal = JSON.parse(insumo).productInput



    this.form.patchValue({
      [this.ctrlName]: this.objetoOriginal.name,
      [this.ctrlCode]: this.objetoOriginal.code,
      [this.ctrlFormato]:this.objetoOriginal.formato,
      [this.ctrlDescripcion]: this.objetoOriginal.description
    });
    this.form.disable();
  }

  cancelar() {
    this.location.back();
  }


}
