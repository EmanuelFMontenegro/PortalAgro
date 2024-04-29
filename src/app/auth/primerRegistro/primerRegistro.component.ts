import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/ApiService';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/pages/dashboard/dialog/dialog.component';

interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
}

@Component({
  selector: 'app-primerRegistro',
  templateUrl: './primerRegistro.component.html',
  styleUrls: ['./primerRegistro.component.sass'],
})
export class PrimerRegistroComponent implements OnInit, AfterViewInit {
  userDetailsForm: FormGroup;
  private userId: number | any;
  public userEmail: string | null = null;
  private personId: number | any;
  locationId: number | null = null;
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades = new FormControl('');
  nombre: string = '';
  apellido: string = '';
  localidades: any[] = [];
  dni: string = '';
  telephone: string = '';
  descriptions: string = '';
  activarEdicion: boolean = false;
  isTermsPopupVisible: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.userDetailsForm = this.formBuilder.group({
      nombre: [
        '',
        [Validators.maxLength(20), Validators.pattern('^[a-zA-Z]+$')],
      ],
      apellido: [
        '',
        [Validators.maxLength(20), Validators.pattern('^[a-zA-Z]+$')],
      ],
      localidad: [null, Validators.required],
      dni: [
        '',
        [
          Validators.minLength(8),
          Validators.maxLength(11),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      contacto: [
        '',
        [
          Validators.minLength(10),
          Validators.maxLength(12),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      descripcion: [''],

      aceptarTerminos: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    this.obtenerLocalidades();
  }

  ngAfterViewInit(): void {}

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

  cargarDatosPerfil() {
    if (!this.validarFormulario()) {
      return;
    }
    const aceptarTerminosControl = this.userDetailsForm.get('aceptarTerminos');
    const aceptarTerminos = aceptarTerminosControl?.value;


    if (aceptarTerminos === null) {
      console.error('El campo aceptarTerminos es null');
      return;
    }


    if (!aceptarTerminos) {
      this.toastr.warning(
        'Debe Aceptar los Términos y Condiciones para continuar.',
        'Atención'
      );
      return;
    }

    // Continuar con el proceso de actualización del perfil
    const formValues = this.userDetailsForm.value;
    const personData = {
      name: formValues.nombre || '',
      lastname: formValues.apellido || '',
      dni: formValues.dni || '',
      telephone: formValues.contacto || '',
      location_id: formValues.localidad || null,
      descriptions: formValues.descripcion || null,
      accept_license: aceptarTerminos,
    };

    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;
      this.personId = this.userId;

      if (this.userId !== null && this.personId !== null) {
        this.actualizarValoresFormulario();
      }
    } else {
      this.userId = null;
      this.userEmail = null;
    }

    // Llamar al endpoint de actualización del perfil
    this.apiService
      .updatePersonAdmin(this.userId, this.personId, personData)
      .subscribe(
        (response) => {
          this.toastr.success(
            'Gracias por actualizar tu perfil:',
            'Bienvenido'
          );
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error(
            'Error al actualizar la información del usuario:',
            error
          );
        }
      );
  }

  actualizarValoresFormulario() {
    const formValues = this.userDetailsForm.value;
    this.nombre = formValues.nombre;
    this.apellido = formValues.apellido;
    this.dni = formValues.dni;
    this.telephone = formValues.contacto;
    this.locationId = formValues.localidad;
    this.descriptions = formValues.descripcion;
  }

  validarFormulario(): boolean {
    const formValues = this.userDetailsForm.value;
    const dniControl = this.userDetailsForm.get('dni');
    const contactoControl = this.userDetailsForm.get('contacto');
    const aceptarTerminosControl = this.userDetailsForm.get('aceptarTerminos');

    if (dniControl?.errors && dniControl.errors['incorrect']) {
      dniControl.setErrors({ incorrect: true });
      return false;
    }

    if (contactoControl?.errors && contactoControl.errors['incorrectSize']) {
      contactoControl.setErrors({ incorrectSize: true });
      return false;
    }

    // Verificar si se han aceptado los términos y condiciones
    if (!aceptarTerminosControl?.value) {
      this.toastr.warning(
        'Debe aceptar los términos y condiciones para continuar.',
        'Atención'
      );
      return false;
    }

    if (
      formValues.nombre?.trim() === '' ||
      formValues.apellido?.trim() === '' ||
      formValues.dni?.trim() === '' ||
      formValues.localidad === null ||
      formValues.contacto?.trim() === ''
    ) {
      this.toastr.warning(
        'Por favor, complete todos los campos obligatorios.',
        'Atención'
      );
      return false;
    }
    return true;
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  cancelar() {
    this.router.navigate(['/login']);
  }
}
