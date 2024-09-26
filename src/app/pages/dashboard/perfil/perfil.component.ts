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
import { startWith, map } from 'rxjs/operators';

interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
}

interface UserData {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  descriptions: string;
  location: {
    id: number;
    name: string;
    department_id: number;
  };
  telephone: string;
  account_active: boolean;
  accept_license: boolean;
  canEdit: any;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html', 
})
export class PerfilComponent implements OnInit, AfterViewInit {
selectedImage: string | ArrayBuffer | null = null;
nombre: string = '';
apellido: string = '';
descripcion: string = '';
dni: string = '';
descriptions: string = '';
location: string = '';
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
userData: UserData | null = null;
avatarFile: File | null = null;
localidad: any[] = [];
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
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        this.selectedImage = reader.result;
      };

      // Asignar la imagen seleccionada a avatarFile y marcar el formulario como dirty
      this.avatarFile = selectedFile;
      this.userDetailsForm.markAsDirty();
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
        this.localidad = localidades;
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
    return this.localidad.filter((loc) =>
      loc.name.toLowerCase().includes(filterValue)
    );
  }

  onLocalidadSelectionChange(localidad: string) {
    const selectedLocation = this.localidad.find(
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
    console.log('Cargando datos del usuario...');
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
          .getPersonByIdProductor(this.userId, this.personId)
          .subscribe(
            (data: UserData) => {
              this.userData = data;
              console.log('Datos del usuario recibidos:', data);

              this.nombre = this.userData.name;
              this.apellido = this.userData.lastname;
              this.dni = this.userData.dni;
              this.location= this.userData.location.name
              this.descriptions = this.userData.descriptions;
              this.telephone = this.userData.telephone;

              this.userDetailsForm.patchValue({
                nombre: this.nombre,
                apellido: this.apellido,
                dni: this.dni,
                contacto: this.telephone,
                localidad: this.location,
                descripcion: this.descriptions,
                accept_license: [true],
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
    if (this.userDetailsForm.dirty || this.avatarFile) {
      if (this.validarFormulario()) {
        const formData = this.userDetailsForm.value;
        this.personId = this.userId;

        if (this.userId !== null && this.personId !== null) {
          const selectedLocation = this.localidad.find(
            (loc) => loc.name === formData.localidad
          );
          const locationId = selectedLocation ? selectedLocation.id : null;

          const personData = {
            name: formData.nombre,
            lastname: formData.apellido,
            dni: formData.dni,
            descriptions: formData.descripcion,
            location_id: locationId,
            telephone: formData.contacto,
            accept_license: true,
          };

          this.apiService
            .updatePersonProductor(this.userId, this.personId, personData)
            .subscribe(
              (response) => {
                console.log("Lo que trae en enpoint de productorPerfil",response)
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
                  error.listDetails.length > 0
                ) {
                  const errores = error.listDetails.map(
                    (detalle: any) => detalle.message
                  );
                  this.toastr.error(
                    errores.join('<br>'),
                    'Error de validación'
                  );
                } else {
                  this.toastr.error(
                    'Ocurrió un error al guardar los cambios.',
                    'Error'
                  );
                }
                console.error('Error al guardar cambios:', error);
              }
            );
        }
      } else {
        this.toastr.warning(
          'El formulario contiene errores. Por favor, revisa los campos.',
          'Advertencia'
        );
      }
    } else {
      this.toastr.info(
        'No se han realizado cambios en el formulario.',
        'Información'
      );
    }
  }

  private validarFormulario(): boolean {
    if (this.userDetailsForm.invalid) {
      this.toastr.warning(
        'El formulario contiene errores. Por favor, revisa los campos.',
        'Advertencia'
      );
      return false;
    }
    return true;
  }

  cancelarEdicion() {
    this.activarEdicion(false);
    this.cargarDatosDeUsuario();
  }
}
