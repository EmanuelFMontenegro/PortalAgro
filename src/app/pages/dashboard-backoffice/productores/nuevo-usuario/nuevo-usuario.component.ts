import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/ApiService';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.sass'],
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
      usuario: ['', Validators.required],
      password: ['', Validators.required],
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
      dni: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(11),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
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

      // Llamar al endpoint de creación de usuario
      this.apiService.crearNuevoUsuario(userData).subscribe(
        (response) => {
          this.toastr.success('Usuario creado exitosamente', 'Éxito');
          this.router.navigate(['/dashboard-backoffice/productores']);
        },
        (errorResponse) => {
          console.error('Error al crear el usuario:', errorResponse);

          // Extraer el objeto de error desde el errorResponse, dependiendo de la estructura del error
          const error = errorResponse.error || errorResponse;

          let errorMessage = 'Error al crear el usuario'; // Mensaje genérico por defecto

          if (error.code === 4002) {
            errorMessage = 'El Email ingresa ya fue regisrado. Por favor, intente con otro email.';
          } else if (error.code === 4023) {
            errorMessage = 'El DNI ingresado ya fue registrado. Por favor, verifique e intente nuevamente.';
          } else if (error.code === 4004) {
            errorMessage = 'La contraseña no cumple con los requisitos de seguridad. Por favor, intente con otra.';
          }
          // Añadir más condiciones según los códigos de error específicos

          this.toastr.error(errorMessage, 'Atención');
        }
      );




}
}
  validarFormulario(): boolean {
    return true; // Ya que no hay campos obligatorios, siempre devolvemos true
  }

  cancelar() {
    this.router.navigate(['dashboard-backoffice/inicio']);
  }
}
