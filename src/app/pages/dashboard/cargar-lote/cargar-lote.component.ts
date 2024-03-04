import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

interface CustomJwtPayload {
  userId: number;
  sub: string;
}

interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
}

@Component({
  selector: 'app-cargar-lote',
  templateUrl: './cargar-lote.component.html',
  styleUrls: ['./cargar-lote.component.sass']
})
export class CargarLoteComponent {
  nombre: string = '';
  apellido: string = '';
  descripcion: string = '';
  dni: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  modoEdicion: boolean = false;
  persona: any = {};
  plantations: any[] = [];
  campoForm: FormGroup;
  filteredPlantations: Observable<any[]> = new Observable<any[]>();
  filtroPlantations = new FormControl('');
  private userId: number | any;
  private personId: number | any;
  public userEmail: string | null = null;

  campoData = {
    name: '',
    plantation:'',
    dimensions: ''

  };
  nameTouched = false;
  dimensionsTouched = false;
  plantationTouched = false;



  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
  ) {

    this.campoForm = this.fb.group({
      name: ['', Validators.required],
      dimensions: ['', [Validators.required, Validators.min(0)]],
      observation: [''],
      plantation: new FormControl('', Validators.required),
    });

  }

  ngOnInit(): void {
    this.cargarDatosDeUsuario();
    this.userEmail = this.authService.getUserEmail();
    this.decodeToken();
    this.obtenerPlantaciones();

  }

  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;
    }
  }

  obtenerPlantaciones() {
    this.apiService.getAllTypePlantationOperador().subscribe(
      (plantations) => {
        this.plantations = plantations;
        this.filteredPlantations = this.filtroPlantations.valueChanges.pipe(
          startWith(''),
          map((value) => {
            if (typeof value === 'string') { // Verifica si value es de tipo string
              return this.filtrarPlantaciones(value);
            } else {
              return []; // Retorna un arreglo vacío si value es null o no es string
            }
          }),
        );
      },
      (error) => {
        console.error('Error al obtener las plantaciones', error);
      }
    );
  }



  private filtrarPlantaciones(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.plantations.filter((planta) => planta.name.toLowerCase().includes(filterValue));
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
            // const localidad = this.localidades.find((loc) => loc.id === data.location_id);
            // this.locationId = localidad ? localidad.name.toString() : '';
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





  cargarLotes(): void {
    if (!this.userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    if (this.campoForm.valid) {
      const nameControl = this.campoForm.get('name');
      const dimensionsControl = this.campoForm.get('dimensions');
      const observationControl = this.campoForm.get('observation');
      const plantationControl = this.campoForm.get('plantation');

      if (nameControl && dimensionsControl && observationControl && plantationControl) {
        const campoData: any = {
          name: nameControl.value,
          dimensions: dimensionsControl.value,
          observation: observationControl.value,
          id: plantationControl.value // Se obtiene el valor seleccionado de la plantación
        };
        console.log('Datos del lote a enviar :', campoData);
        // Aquí actualizamos la plantación utilizando el servicio ApiService
        this.apiService.updateTypePlantationAdmin(campoData.id, campoData).subscribe(
          () => {
            this.toastr.success('Campo actualizado con éxito', 'Éxito');
            this.campoForm.reset();
            this.router.navigate(['dashboard/geolocalizacion']);
          },
          (error) => {
            console.error('Error al actualizar el campo:', error);
            if (error.error && error.error.message) {
              this.toastr.error('Error al actualizar el campo: ' + error.error.message, 'Atención');
            } else {
              this.toastr.error('Error al actualizar el campo. Detalles: ' + error.message, 'Error');
            }
          }
        );
      } else {
        console.error('Error: Al menos uno de los controles del formulario es nulo.');
      }
    } else {
      this.toastr.error('Por favor, completa todos los campos requeridos', 'Error');
    }
  }




  cancelar() {
    this.router.navigate(['dashboard/inicio']);
  }
}
