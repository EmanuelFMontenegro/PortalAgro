import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
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
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
}

interface UserData {
  dni: string;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  descripcion: string;
  telefono: string;
  localidad: number | null;
  email: string;
}

@Component({
  selector: 'app-perfil-productor',
  templateUrl: './perfil-productor.component.html',
  styleUrls: ['./perfil-productor.component.sass'],
})
export class PerfilProductorComponent implements OnInit, AfterViewInit {
  usuario: any;
  selectedImage: string | ArrayBuffer | null = null;
  nombre: string = '';
  apellido: string = '';
  descripcion: string = '';
  dni: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telefono: string = '';
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
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.userDetailsForm = this.formBuilder.group({
      nombre: [''],
      apellido: [''],
      localidad: [null],
      dni: [''],
      contacto: [''],
      descripcion: [''],
      contrasenaActual: [''],
      contrasenaNueva: [''],
    });

  }

  ngOnInit(): void {
    this.obtenerLocalidades();
    this.cargarDatosDeUsuario();

    const usuarioData = localStorage.getItem('selectedUser');

    if (usuarioData) {
      const usuario: Usuario = JSON.parse(usuarioData);

      this.userId = usuario.id;
      this.personId = usuario.id;

      this.cargarDatosUsuarioPerfil(usuario);
    } else {
      console.error('No se encontraron datos del usuario en localStorage.');
      this.router.navigate(['dashboard-backoffice']);
    }
  }

  ngAfterViewInit(): void {
    this.componenteInicializado = true;
  }

  cargarUsuario(userId: number) {
    this.apiService.getUserById(userId).subscribe(
      (data) => {
        this.usuario = data;
      },
      (error) => {
        console.error('Error al cargar los datos del usuario:', error);
      }
    );
  }
  // Metodo para los datos que se obtiene de la card de productores
  cargarDatosUsuarioPerfil(usuario: Usuario): void {
    this.userId = usuario.id;
    this.personId = usuario.id;
    this.nombre = usuario.nombre;
    this.apellido = usuario.apellido;
    this.dni = usuario.dni;
    this.descripcion = usuario.descripcion;
    this.telefono = usuario.telefono;
    this.locationId = usuario.localidad;
    this.userEmail = usuario.email || null;
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
      this.userDetailsForm.enable(); // Habilitar el formulario
      // Asignar los valores del usuario al formulario
      this.userDetailsForm.patchValue({
        nombre: this.nombre,
        apellido: this.apellido,
        localidad: this.locationId,
        dni: this.dni,
        contacto: this.telefono,
      });
    } else {
      this.userDetailsForm.disable(); // Deshabilitar el formulario
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
    // Obtener usuario del localStorage
    const usuarioData = localStorage.getItem('selectedUser');

    if (usuarioData) {
      const usuario: Usuario = JSON.parse(usuarioData);
      this.userId = usuario.id;
      this.personId = usuario.id; // Se usa el mismo id para personId

      const decoded: DecodedToken = jwtDecode(
        this.authService.getToken() || ''
      );
      if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
        this.userEmail = decoded.sub;

        if (this.avatarFile) {
          this.cargarImagenPerfil();
        }

        if (this.userId !== null && this.personId !== null) {
          this.apiService
          .getPersonByIdOperador(this.userId, this.personId)
          .subscribe(
            (data) => {
              // Otros datos...
              const localidad = this.localidades.find(
                (loc) => loc.id === data.location.id
              );
              this.locationId = localidad ? localidad.id : null; // Asignar ID en lugar de nombre

              this.userDetailsForm.patchValue({
                nombre: this.nombre,
                apellido: this.apellido,
                dni: this.dni,
                contacto: this.telefono,
                localidad: this.locationId,
                descripcion: this.descriptions,
              });

              this.cd.detectChanges();
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
    } else {
      console.error('No se encontraron datos de usuario en localStorage.');
      this.router.navigate(['dashboard-backoffice']);
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
  actualizarPerfilUsuario() {
    if (this.userDetailsForm.dirty) {
      if (this.validarFormulario()) {
        const formData = this.userDetailsForm.value;

        // Obtener usuario del localStorage
        const usuarioData = localStorage.getItem('selectedUser');

        if (usuarioData) {
          const usuario: Usuario = JSON.parse(usuarioData);
          this.userId = usuario.id;
          this.personId = usuario.id; // Se usa el mismo id para personId

          if (this.userId !== null && this.personId !== null) {
            const selectedLocation = this.localidades.find(
              (loc) => loc.name === formData.localidad
            );
            const locationId = selectedLocation ? selectedLocation.id : null;

            // Construir el objeto personData sin incluir locationId si no es válido
            const personData: any = {
              userId: this.userId,
              name: formData.nombre,
              lastname: formData.apellido,
              dni: formData.dni,
              // Usa locationId aquí en lugar de this.locationId
              localidad: locationId,
              descriptions: formData.descripcion,
              telephone: formData.contacto,
              accept_license: true,
            };

            // No hay necesidad de verificar nuevamente locationId, ya lo hiciste arriba

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

                  // Navegar a la vista principal después de actualizar el perfil
                  this.router.navigate([
                    'dashboard-backoffice/perfil-prodcutorl',
                  ]);
                },
                (error) => {
                  // Manejo de errores omitido por brevedad
                }
              );
          } else {
            // Manejo de errores omitido por brevedad
          }
        } else {
          // Manejo de errores omitido por brevedad
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
