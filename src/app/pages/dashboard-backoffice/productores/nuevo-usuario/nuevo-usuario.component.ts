import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/ApiService';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html'
})
export class NuevoUsuarioComponent implements OnInit, AfterViewInit {
  userDetailsForm: FormGroup;
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades = new FormControl('');
  localidades: any[] = [];
  isTermsPopupVisible: boolean = false;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.userDetailsForm = this.formBuilder.group({
      usuario: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/)
      ]],
      nombre: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z]+$'),
        ],
      ],
      apellido: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z]+$'),
        ],
      ],
      localidad: [null, Validators.required],
      dni: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(8),
        Validators.pattern('^[0-9]{7,8}$') 
      ]],
      contacto: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(12),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      descripcion: [''],
      isPreAcceptTherms: [false],
      isPreActivate: [false],
    });
  }

  ngOnInit(): void {
    this.obtenerLocalidades();
  }

  ngAfterViewInit(): void {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  openTermsPopup(): void {
    this.isTermsPopupVisible = true;
  }

  closeTermsPopup(): void {
    this.isTermsPopupVisible = false;
  }

  obtenerLocalidades() {
    this.apiService.getLocationMisiones('location').subscribe(
      (localidades) => {
        this.localidades = localidades;
        this.filteredLocalidades = this.filtroLocalidades.valueChanges.pipe(
          startWith(''),
          map((value) => this.filtrarLocalidades(value ?? ''))
        );
      },
      (error) => {
        console.error('Error al obtener las localidades', error);
      }
    );
  }

  private filtrarLocalidades(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.localidades.filter((loc) =>
      loc.name.toLowerCase().includes(filterValue)
    );
  }

  cargarNuevoUsuario() {
    console.log('Formulario:', this.userDetailsForm.value);
    console.log('Formulario:', this.userDetailsForm.valid);
    if (this.userDetailsForm.valid) {
      const formValues = this.userDetailsForm.value;

      const userData = {
        username: formValues.usuario,
        password: formValues.password,
        name: formValues.nombre,
        lastname: formValues.apellido,
        dni: formValues.dni,
        telephone: formValues.contacto,
        location_id: formValues.localidad,
        descriptions: formValues.descripcion,
        isPreAcceptTherms: formValues.isPreAcceptTherms,
        isPreActivate: formValues.isPreActivate,
      };

      this.apiService.crearNuevoUsuario(userData).subscribe(
        (response) => {
          this.toastr.success('Usuario creado exitosamente', 'Éxito');
          this.router.navigate(['/dashboard-backoffice/productores']);
        },
        (errorResponse) => {
          console.error('Error al crear el usuario:', errorResponse);

          const error = errorResponse.error || errorResponse;

          let errorMessage = 'Error al crear el usuario';

          if (error.code === 4002) {
            errorMessage = 'El Email ingresado ya fue registrado. Por favor, intente con otro email.';
          } else if (error.code === 4023) {
            errorMessage = 'El DNI ingresado ya fue registrado. Por favor, verifique e intente nuevamente.';
          } else if (error.code === 4004) {
            errorMessage = 'La contraseña no cumple con los requisitos de seguridad. Por favor, intente con otra.';
          } else if (error.code === 403) {
            errorMessage = 'No tienes permisos suficientes para crear usuarios. Por favor, contacta a tu administrador.';
          }

          this.toastr.warning(errorMessage, 'Atención');
        }
      );
    }
  }


  validarFormulario(): boolean {
    return true;
  }

  cancelar() {
    this.router.navigate(['dashboard-backoffice/productores']);
  }
}
