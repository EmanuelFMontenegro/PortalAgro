import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/ApiService';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import {
  startWith,
  map,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';

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
  selectedImage: string | ArrayBuffer | null = null;
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
    private toastr: ToastrService
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
      localidad: [null], // Eliminamos Validators.required
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
  // Cambiamos la firma de la función cargarImagenPerfil para que no requiera ningún argumento
  cargarImagenPerfil() {
    const selectedFile = this.avatarFile;
    if (selectedFile) {
      this.apiService
        .actualizarImagenDePerfil(this.userId, selectedFile)
        .subscribe(
          (response) => {
            this.cargarDatosDeUsuario();
          },
          (error) => {
            console.error('Error al cargar la imagen de perfil:', error);
          }
        );
    }
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Leer la imagen como un objeto URL local
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        this.selectedImage = reader.result;
      };

      // Asignar la imagen seleccionada a avatarFile y actualizar el valor del formulario
      this.avatarFile = selectedFile;
      this.userDetailsForm.patchValue({
        avatar: selectedFile, // Puede ser necesario ajustar el nombre del control dependiendo del nombre en el formulario
      });
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

  onLocalidadSelectionChange(localidad: string) {
    const selectedLocation = this.localidades.find(
      (loc) => loc.name === localidad
    );
    if (selectedLocation) {
      this.userDetailsForm.patchValue({
        localidad: selectedLocation.name,
      });
      this.selectedLocationId = selectedLocation.id;
    }
  }

  cargarDatosDeUsuario() {
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;

      if (this.avatarFile) {
        this.cargarImagenPerfil();
      }
      this.personId = this.userId;

      if (this.userId !== null && this.personId !== null) {
        this.apiService
          .getPersonByIdOperador(this.userId, this.personId)
          .subscribe(
            (data) => {

              this.nombre = data.name;
              this.apellido = data.lastname;
              this.dni = data.dni;
              this.descriptions = data.descriptions;
              this.telephone = data.telephone;
              const localidad = this.localidades.find(
                (loc) => loc.id === data.location.id
              );
              this.locationId = localidad ? localidad.name : null; // Cambiar aquí
             
              this.userDetailsForm.patchValue({
                nombre: this.nombre,
                apellido: this.apellido,
                dni: this.dni,
                contacto: this.telephone,
                localidad: this.locationId, // Cambiar aquí
                descripcion: this.descriptions,
              });
            },
            (error) => {
              console.error(
                'Error al obtener nombre y apellido del usuario:',
                error
              );
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
        if (response && response.data && response.data.length > 0) {
          const usuarioExistente = response.data[0];
          if (usuarioExistente.id !== this.personId) {
            this.toastr.warning(
              `Ya existe una persona registrada con este dni.`,
              'Atención'
            );
            this.userDetailsForm
              .get('dni')
              ?.setErrors({ dniExistsForOtherUser: true });

            this.userDetailsForm.disable();
          } else {
            this.toastr.info(
              `El dni ${dni} no está registrado para otro usuario. Puedes editar.`,
              'Información'
            );
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
          const selectedLocation = this.localidades.find(
            (loc) => loc.name === formData.localidad
          );
          const locationId = selectedLocation ? selectedLocation.id : null;

          const personData = {
            userId: this.userId,
            name: formData.nombre,
            lastname: formData.apellido,
            dni: formData.dni,
            descriptions: formData.descripcion,
            location_id: locationId,
            telephone: formData.contacto,
          };

          this.apiService
            .updatePersonAdmin(this.userId, this.personId, personData)
            .subscribe(
              (response) => {
                this.toastr.success(
                  '¡Perfil actualizado correctamente!',
                  'Éxito'
                );
                this.activarEdicion(false);
                this.cargarDatosDeUsuario();
              },
              (error) => {
                if (
                  error.status === 4012 &&
                  error.listDetails &&
                  error.listDetails.lastname
                ) {
                  this.toastr.warning(
                    'Disculpe, su apellido excede el ingreso permitido',
                    'Atención'
                  );
                } else if (error.status === 403) {
                  this.toastr.warning(
                    'Este usuario no está registrado. Por favor regístrese para iniciar sesión.',
                    'Atención'
                  );
                } else {
                  this.toastr.warning(
                    'Error al actualizar el perfil: Su apellido o nombre es demasiado extenso.',
                    'Atención'
                  );

                }
              }
            );
        } else {
          this.toastr.error(
            '¡Error al obtener información del usuario!',
            'Atención'
          );
        }
      }
    } else {
      this.toastr.info('No se realizaron modificaciones.', 'Información');
    }
  }

  validarFormulario(): boolean {

    return true; // Retornar siempre true para permitir guardar los cambios
  }
}
