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

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.userDetailsForm = this.formBuilder.group({
      nombre: ['', [Validators.maxLength(20), Validators.pattern('^[a-zA-Z]+$')]],
      apellido: ['', [Validators.maxLength(20), Validators.pattern('^[a-zA-Z]+$')]],
      localidad: [null, Validators.required],
      dni: ['', [Validators.minLength(8), Validators.maxLength(11), Validators.pattern('^[0-9]+$')]],
      contacto: ['', [Validators.minLength(10), Validators.maxLength(12), Validators.pattern('^[0-9]+$')]],
      descripcion: [''],
    });
  }

  ngOnInit(): void {
    this.obtenerLocalidades();
  }

  ngAfterViewInit(): void {}

  obtenerLocalidades() {
    this.apiService.getLocationMisiones('location').subscribe(
      (localidades) => {
        this.localidades = localidades;
        console.log('Estas son las localidades', this.localidades);
        this.filteredLocalidades = this.filtroLocalidades.valueChanges.pipe(
          startWith(''),
          map((value) => this.filtrarLocalidades(value ?? '')),
        );
      },
      (error) => {
        console.error('Error al obtener las localidades', error);
      }
    );
  }

  private filtrarLocalidades(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.localidades.filter((loc) => loc.name.toLowerCase().includes(filterValue));
  }

  // cargarDatosPerfil() {
  //   const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
  //   if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
  //     this.userId = decoded.userId;
  //     this.userEmail = decoded.sub;

  //     this.personId = this.userId;

  //     if (this.userId !== null && this.personId !== null) {
  //       // Eliminamos la llamada a getPersonByIdOperador
  //       this.actualizarValoresFormulario();
  //     }
  //   } else {
  //     this.userId = null;
  //     this.userEmail = null;
  //   }
  // }

  cargarDatosPerfil() {
    if (!this.validarFormulario()) {
      return;
    }

    const personData = {
      name: this.userDetailsForm.get('nombre')?.value || '',
      lastname: this.userDetailsForm.get('apellido')?.value || '',
      dni: this.userDetailsForm.get('dni')?.value || '',
      telephone: this.userDetailsForm.get('contacto')?.value || '',
      location_id: this.userDetailsForm.get('localidad')?.value || null,
      descriptions: this.userDetailsForm.get('descripcion')?.value || null,
    };
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;

      this.personId = this.userId;

      if (this.userId !== null && this.personId !== null) {
        // Eliminamos la llamada a getPersonByIdOperador
        this.actualizarValoresFormulario();
      }
    } else {
      this.userId = null;
      this.userEmail = null;
    }
    this.apiService.updatePersonAdmin(this.userId, this.personId, personData).subscribe(
      (response) => {
        this.toastr.success('Gracias por actualizar tu perfil:', 'Bienvenido')
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Error al actualizar la información del usuario:', error);
        this.toastr.error('Tuvimos un problema en actualizar tu perfil:', 'Atencion')
      }
    );
  }


  actualizarValoresFormulario() {
    this.userDetailsForm.patchValue({
      nombre: this.nombre,
      apellido: this.apellido,
      dni: this.dni,
      contacto: this.telephone,
      localidad: this.locationId || null,
      descripcion: this.descriptions,
    });
  }

  validarFormulario(): boolean {
    const formValues = this.userDetailsForm.value;
    if (
      formValues.nombre?.trim() === '' ||
      formValues.apellido?.trim() === '' ||
      formValues.dni?.trim() === '' ||
      formValues.localidad === null ||
      formValues.contacto?.trim() === ''

    ) {
      this.toastr.warning('Por favor, complete todos los campos obligatorios.', 'Atención');
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
