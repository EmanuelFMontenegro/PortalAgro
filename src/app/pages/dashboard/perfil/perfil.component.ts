import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/ApiService';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
}

interface UserData {
  dni: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.sass'],
})
export class PerfilComponent implements OnInit, AfterViewInit {
  nombre: string = '';
  apellido: string = '';
  descripcion: string = '';
  dni: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  modoEdicion: boolean = false;
  persona: any = {};
  private userId: number | any;
  private personId: number | any;
  public userEmail: string | null = null;
  selectedLocationId: number | null = null;
  private datosUsuarioTemporal: any = {};
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades = new FormControl('');
  userDetailsForm: FormGroup;
  avatarFile: File | null = null;
  localidades: any[] = [];
  contacto = '';
  contrasenaActual = '';
  contrasenaNueva = '';
  private componenteInicializado: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
  ) {
    this.userDetailsForm = this.formBuilder.group({
      nombre: ['', [Validators.maxLength(20), Validators.pattern('^[a-zA-Z]+$')]],
      apellido: ['', [Validators.maxLength(20), Validators.pattern('^[a-zA-Z]+$')]],
      localidad: [null, Validators.required],
      dni: ['', [Validators.minLength(8), Validators.maxLength(11), Validators.pattern('^[0-9]+$')]],
      contacto: ['', [Validators.minLength(10), Validators.maxLength(12), Validators.pattern('^[0-9]+$')]],
      descripcion: [''],
      contrasenaActual: [''],
      contrasenaNueva: [''],
    });


  }

  ngOnInit(): void {
    this.obtenerLocalidades();
    this.cargarDatosDeUsuario();
  }

  ngAfterViewInit(): void {

    this.componenteInicializado = true;


  }

  cargarNuevoAvatar(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.avatarFile = fileList[0];
    }
  }

  activarEdicion(modoEdicion: boolean) {
    this.modoEdicion = modoEdicion;
    if (modoEdicion) {
      this.userDetailsForm.enable();
      this.userDetailsForm.patchValue(this.datosUsuarioTemporal);



    } else {
      this.userDetailsForm.disable();
    }
  }


  obtenerLocalidades() {
    this.apiService.getLocationMisiones('location').subscribe(
      (localidades) => {
        this.localidades = localidades;
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

  cargarDatosDeUsuario() {
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;

      this.personId = this.userId;

      if (this.userId !== null && this.personId !== null) {
        this.apiService.getPersonByIdOperador(this.userId, this.personId).subscribe(
          (data) => {
            this.nombre = data.name;
            this.apellido = data.lastname;
            this.dni = data.dni;
            this.descriptions = data.descriptions;
            this.telephone = data.telephone;
            const localidad = this.localidades.find((loc) => loc.id === data.location_id);
            this.locationId = localidad ? localidad.name.toString() : '';

            this.userDetailsForm.patchValue({
              nombre: this.nombre,
              apellido: this.apellido,
              dni: this.dni,
              contacto: this.telephone,
              localidad: localidad ? localidad.id : null,
              descripcion: this.descriptions,
            });


          },
          (error) => {
            console.error('Error al obtener nombre y apellido del usuario:', error);
          }
        );
      }
    } else {
      this.userId = null;
      this.userEmail = null;
    }
  }




verificarExistenciadni(dni: string): void {

  this.apiService.existsPersonByParamsAdmin(dni).subscribe(
    (response) => {
      console.log('Respuesta del servidor:', response);

      if (response && response.data && response.data.length > 0) {

        const usuarioExistente = response.data[0];
        if (usuarioExistente.id !== this.personId) {

          this.toastr.warning(
            `Ya existe una persona registrada con este dni.`,
            'Atención'
          );
          this.userDetailsForm.get('dni')?.setErrors({ 'dniExistsForOtherUser': true });

          this.userDetailsForm.disable();
        } else {

          this.toastr.info(`El dni ${dni} no está registrado para otro usuario. Puedes editar.`, 'Información');
          this.userDetailsForm.get('dni')?.setErrors(null);
        }
      }
    },
    (error) => {
      console.error('Error al verificar el dni:', error);
    }
  );
}
guardarCambios() {
  if (this.userDetailsForm.dirty) {
    if (this.validarFormulario()) {
      const formData = this.userDetailsForm.value;
      this.personId = this.userId;

      if (this.userId !== null && this.personId !== null) {
        const personData = {
          userId: this.userId,
          name: formData.nombre,
          lastname: formData.apellido,
          dni: formData.dni,
          descriptions: formData.descripcion,
          location_id: +formData.localidad,
          telephone: formData.contacto,
        };

        this.apiService.updatePersonAdmin(this.userId, this.personId, personData).subscribe(
          (response) => {
            this.toastr.success('¡Perfil actualizado correctamente!', 'Éxito');
            this.activarEdicion(false);
            this.cargarDatosDeUsuario();

            // Llamada al método cambiarContrasena para cambiar la contraseña
            this.apiService.cambiarContrasena(formData.contrasenaNueva, formData.contrasenaNueva, 'token').subscribe(
              (resultado) => {
                // Maneja el resultado de la llamada cambiarContrasena si es necesario
              },
              (error) => {
                // Maneja los errores de la llamada cambiarContrasena si es necesario
              }
            );
          },
          (error) => {
            this.toastr.error('¡Ya Existe una persona registrada con este dni!', 'Atención');
          }
        );
      } else {
        this.toastr.error('¡Error al obtener información del usuario!', 'Atención');
      }
    }
  } else {
    this.toastr.info('No se realizaron modificaciones.', 'Información');
  }
}

  validarFormulario(): boolean {
    if (this.userDetailsForm.get('nombre')?.value.trim() === '' ||
      this.userDetailsForm.get('apellido')?.value.trim() === '' ||
      this.userDetailsForm.get('dni')?.value.trim() === '' ||
      this.userDetailsForm.get('contacto')?.value.trim() === '') {
      this.toastr.warning('Por favor, complete todos los campos obligatorios.', 'Atención');
      return false;
    }
    return true;
  }
}
