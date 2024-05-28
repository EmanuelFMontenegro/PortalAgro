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
import { Observable } from 'rxjs';
import { startWith, map, timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

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

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: string;
  account_active: boolean;
  accountNonLocked: boolean;
  failedAttempts: number;
  lockeTime: string | null;
  role: Role;
}

interface Person {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  descriptions: string;
  location_id: number;
  telephone: string;
  user: User;
}

interface ApiResponse {
  list: Person[][];
  pageNo: number;
  pageSize: number;
  pageTotal: number;
  itemsTotal: number;
  pageLast: boolean;
  canEdit: boolean;
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
  email: string = '';
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
  isTermsPopupVisible: boolean = false;
  hidePassword = true;
  isPasswordDisabled = true;
  
  showPasswordWarning = false;

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
      email: ['', [Validators.required, Validators.email]],
      password: [{ value: '', disabled: this.isPasswordDisabled }, Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      descripcion: ['', Validators.required],
      localidad: ['', Validators.required],
      contacto: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.obtenerLocalidades();

    const usuarioData = localStorage.getItem('selectedUser');
    if (usuarioData) {
      const usuario: Usuario = JSON.parse(usuarioData);

      this.userId = usuario.id;
      this.personId = usuario.id;


      this.UsuarioPerfil(this.userId,this.personId);
      this.cargarDatosUsuarioPerfil(usuario);
    } else {
      console.error('No se encontraron datos del usuario en localStorage.');
      this.router.navigate(['dashboard-backoffice']);
    }
  }

  ngAfterViewInit(): void {
    this.componenteInicializado = true;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  enablePasswordField(): void {
    this.isPasswordDisabled = false;
    this.userDetailsForm.get('password')?.enable();
  }
  showChangePasswordWarning(): void {
    this.showPasswordWarning = true;
  }

  UsuarioPerfil(userId: number, personId: number): void {
    this.apiService.getPersonByIdProductor(userId, personId).subscribe(
      (data: Person) => {
        if (!data) {
          console.error('No se encontraron datos del usuario.');
          return;
        }

        this.usuario = data;

        if (data.user && data.user.username) {
          this.email = data.user.username;
        } else {
          console.error('No se encontró el email del usuario.');
        }
      },
      (error) => {
        console.error('Error al cargar los datos del usuario:', error);
      }
    );
  }


  cargarDatosUsuarioPerfil(usuario: Usuario): void {
    this.userId = usuario.id;
    this.personId = usuario.id;
    this.nombre = usuario.nombre;
    this.apellido = usuario.apellido;
    this.dni = usuario.dni;
    this.descripcion = usuario.descripcion;
    this.telefono = usuario.telefono;
    this.locationId = usuario.localidad;
  }

  cargarImagenPerfil() {
    const selectedFile = this.avatarFile;
    if (selectedFile) {
      this.apiService
        .actualizarImagenDePerfil(this.userId, selectedFile)
        .subscribe(
          (response) => {},
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

      this.avatarFile = selectedFile;
      this.userDetailsForm.patchValue({
        avatar: selectedFile,
      });
    }
  }

  activarEdicion(modoEdicion: boolean) {
    this.modoEdicion = modoEdicion;
    if (modoEdicion) {
      this.userDetailsForm.enable();

      this.userDetailsForm.patchValue({
        nombre: this.nombre,
        apellido: this.apellido,
        localidad: this.locationId,
        email: this.email,
        dni: this.dni,
        contacto: this.telefono,
      });
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
        const usuarioData = localStorage.getItem('selectedUser');

        if (usuarioData) {
          const usuario = JSON.parse(usuarioData);
          const userId = usuario.id;
          const personId = usuario.id;
          const selectedLocation = this.localidades.find(
            (loc) => loc.name === formData.localidad
          );
          const locationId = selectedLocation ? selectedLocation.id : null;

          const personData = {
            username: formData.email,
            password: formData.password,
            name: formData.nombre,
            lastname: formData.apellido,
            dni: formData.dni,
            descriptions: formData.descripcion,
            location_id: locationId,
            telephone: formData.contacto,
            isPreActivate: true,
            isPreAcceptTherms: true,
            isVerified: true,
          };

          this.apiService
            .updatePersonAdmin(userId, personId, personData)
            .subscribe(
              (response) => {
                this.toastr.success(
                  '¡Perfil actualizado correctamente!',
                  'Éxito'
                );



                this.modoEdicion=false;
              },
              (error) => {
                console.error('Error al actualizar el perfil:', error);
                this.toastr.error('Error al actualizar el perfil.', 'Error');
              }
            );
        } else {
          this.toastr.error(
            'Error al actualizar el perfil.', 'Error'
          );
        }
      }
    } else {
      this.toastr.info('No se realizaron modificaciones.', 'Información');
    }
  }

  validarFormulario(): boolean {
    return true;
  }

  btnVerMas() {
    this.router.navigate(['dashboard-backoffice/chacras']);
  }
}
