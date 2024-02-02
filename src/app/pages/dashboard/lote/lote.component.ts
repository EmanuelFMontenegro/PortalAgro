// Import necessary Angular modules and components
import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router, ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


// Define interfaces for JWT payload and decoded token
interface CustomJwtPayload {
  userId: number;
  sub: string;
}

interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
}
interface Lote {
  id: number;
  nombre: string;
  descripcion: string;
  plantacion: string;
  hectareas: number;
  // ... other properties
}
@Component({
  selector: 'app-lote',
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.sass']
})
export class LoteComponent {
  loteForm: FormGroup;
  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  descriptions: string = '';
  locationId: number | null = null;
  telephone: string = '';
  modoEdicion: boolean = false;
  persona: any = {};
  localidades: any[] = [];
  filteredLocalidades: Observable<any[]> = new Observable<any[]>();
  filtroLocalidades = new FormControl('');
  private userId: number | any;
  private personId: number | any;
  public userEmail: string | null = null;

  campoData = {
    name: '',
    dimensions: '',
    geolocation: '',
    address: {
      address: '',
      location: ''
    }
  };
  nameTouched = false;
  dimensionsTouched = false;
  geolocationTouched = false;
  locationTouched = false;
  addressTouched = false;
  observationTouched = false;
  campoSeleccionado: any = {};

  // MatTable properties
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'plantacion', 'hectareas', 'acciones'];




  // ViewChild decorators for accessing MatPaginator and MatSort
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  // Constructor with injected services
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.loteForm = this.fb.group({
      nombre: ['', Validators.required],
      plantación: ['', Validators.required],
      dimensions: ['', [Validators.required, Validators.min(0)]],
      observation: [''],
    });
  }

  // Lifecycle hook: Component initialization
  ngOnInit(): void {
    // Load user data and decode token on component initialization
    this.cargarDatosDeUsuario();
    this.userEmail = this.authService.getUserEmail();
    this.decodeToken();

    // Subscribe to route parameters to get selected field data
    this.route.paramMap.subscribe(params => {
      const campoSeleccionadoParam = params.get('campoSeleccionado');
      if (campoSeleccionadoParam) {
        this.campoSeleccionado = JSON.parse(campoSeleccionadoParam);
      }
    });

    // Initialize MatTableDataSource
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    const fieldId = 1;
    // Load data for MatTableDataSource
    this.loadDataForMatTable(fieldId);
  }

  // Method to decode JWT token and extract userId
  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;
    }
  }

  // Method to load user data from API
  cargarDatosDeUsuario() {
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      this.userEmail = decoded.sub;

      this.personId = this.userId;

      if (this.userId !== null && this.personId !== null) {
        // API call to get user details
        this.apiService.getPersonByIdOperador(this.userId, this.personId).subscribe(
          (data) => {
            this.nombre = data.name;
            this.apellido = data.lastname;
            this.dni = data.dni;
            this.descriptions = data.descriptions;
            this.telephone = data.telephone;
            const localidad = this.localidades.find((loc) => loc.id === data.location_id);
            this.locationId = localidad ? localidad.name.toString() : '';
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

  registrarLote(): void {
    if (!this.userId) {
      console.log('este es el ide del señor',this.userId)
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    if (this.loteForm.valid) {
      // Obtener referencias a los controles del formulario
      const nameControl = this.loteForm.get('name');
      const dimensionsControl = this.loteForm.get('dimensions');
      const addressControl = this.loteForm.get('address');
      const localidadControl = this.loteForm.get('localidad');
      const observationControl = this.loteForm.get('observation');  // Obtener control de observación

      // Verificar que los controles no son nulos
      if (nameControl && dimensionsControl && addressControl && localidadControl && observationControl) {
        const fixedGeolocation = "10°38'26'' - 10°38'26''";



        const campoData: any = {
          name: nameControl.value,
          dimensions: dimensionsControl.value,
          geolocation: fixedGeolocation,
          address: {
            address: this.loteForm.get('address')?.value,
            location_id: this.loteForm.get('localidad')?.value
          },
          observation: observationControl?.value
        };

        this.apiService.addField(this.userId, campoData).subscribe(
          () => {
            this.toastr.success('Campo registrado con éxito', 'Éxito');
            this.loteForm.reset();
            this.router.navigate(['dashboard/geolocalizacion']);
          },
          (error) => {
            console.error('Error al registrar el campo:', error);
            if (error.error && error.error.message) {
              this.toastr.error('Ya Existe un campo registrado con este nombre.', 'Atención');
            } else {
              this.toastr.error('Error al registrar el campo. Detalles: ' + error.message, 'Error');
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

    volver(){
        this.router.navigate(['dashboard/detalle-campo']);

    }
loadDataForMatTable(fieldId: number): void {
  if (this.userId !== null) {
    this.apiService.getAllPlotsOperador(this.userId, fieldId).subscribe(
      (response: any) => {
        // Extract the data from the nested array
        const lotsArray: Lote[][] = response?.list?.[0] || [];

        // Flatten the array of lots
        const data: Lote[] = lotsArray.reduce((acc, curr) => acc.concat(curr), []);

        // Log the data to the console
        console.log('Data:', data);

        // Set the data to the MatTableDataSource
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error loading data for MatTableDataSource:', error);
      }
    );
  } else {
    console.error('User ID is null. Cannot load data.');
  }
}









  // Method to handle editing a plot
  editarLote(lote: any): void {
    // Implementation
  }

  // Method to handle confirming plot deletion
  confirmarBorrado(lote: any): void {
    // Implementation
  }
}
