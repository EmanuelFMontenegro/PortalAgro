import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/ApiService';
import { AuthService } from 'src/app/services/AuthService';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
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
      localidad: [''],
      dni: [''],
      contacto: [''],
      descripcion: [''],
      contrasenaActual: [''],
      contrasenaNueva: [''],
    });
  }

  ngOnInit(): void {
    this.obtenerLocalidades();

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

  cargarImagenPerfil() {
    const selectedFile = this.avatarFile;
    if (selectedFile) {
      this.apiService.actualizarImagenDePerfil(this.userId, selectedFile).subscribe(
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
            this.userDetailsForm.get('dni')?.setErrors({ dniExistsForOtherUser: true });

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
          const usuario: Usuario = JSON.parse(usuarioData);
          this.userId = usuario.id;
          this.personId = usuario.id;

          if (this.userId !== null && this.personId !== null) {
            const selectedLocation = this.localidades.find(
              (loc) => loc.name === formData.localidad
            );
            const locationId = selectedLocation ? selectedLocation.id : null;
            const personData: any = {
              userId: this.userId,
              name: formData.nombre,
              lastname: formData.apellido,
              dni: formData.dni,
              location_id: locationId,
              descriptions: formData.descripcion,
              telephone: formData.contacto,
              accept_license: true,
            };

            this.apiService.updatePersonAdmin(this.userId, this.personId, personData).subscribe(
              (response) => {
                this.toastr.success('¡Perfil actualizado correctamente!', 'Éxito');

                // Actualizar los datos del perfil en el componente
                this.nombre = formData.nombre;
                this.apellido = formData.apellido;
                this.dni = formData.dni;
                this.descripcion = formData.descripcion;
                this.telefono = formData.contacto;
                this.locationId = locationId;

                // Forzar la detección de cambios
                this.cd.detectChanges();

                this.activarEdicion(false);
                this.router.navigate(['dashboard-backoffice/perfil-productor']);
              },
              (error) => {
                console.error('Error al actualizar el perfil:', error);
                this.toastr.error('Error al actualizar el perfil.', 'Error');
              }
            );
          } else {
            console.error('No se encontraron los IDs del usuario y la persona.');
            this.toastr.error('No se encontraron los IDs del usuario y la persona.', 'Error');
          }
        } else {
          console.error('No se encontraron datos del usuario en localStorage.');
          this.toastr.error('No se encontraron datos del usuario en localStorage.', 'Error');
        }
      }
    } else {
      this.toastr.info('No se realizaron modificaciones.', 'Información');
      this.activarEdicion(false);
    }
  }

  validarFormulario(): boolean {
    return true;
  }

  btnVerMas() {
    this.router.navigate(['dashboard-backoffice/chacras']);
  }
}
