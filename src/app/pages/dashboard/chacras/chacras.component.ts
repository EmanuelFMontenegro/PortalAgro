import { Component, OnInit, Output } from '@angular/core'; 
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router'; 
import { FilterConfig, ButtonConfig } from 'src/app/models/searchbar.model';
import { TipoLabel, DataView } from 'src/app/shared/components/miniatura-listado/miniatura.model';
import { selectButtons, selectFilters } from 'src/app/shared/components/dinamic-searchbar/dinamic-searchbar.config';
export type FilterInputType = 'text' | 'select' | 'double-number' | 'select-options';

 
 
 

interface Chacra {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-chacras',
  templateUrl: './chacras.component.html',
})
export class ChacrasComponent implements OnInit {
  @Output() mensaje = 'No Existen este filtro'; 
  userLogeed = this.authService.userLogeed;
  currentYear: number = new Date().getFullYear();
  filterConfigs: FilterConfig[] = [];
  buttonConfigs: ButtonConfig[] = [];
  nombre: string = '';
  apellido: string = '';
  descripcion: string = '';
  dniCuit: string = '';
  descriptions: string = '';
  location: number | null = null;
  telephone: string = '';
  nombreCampo: string = '';
  localidad: string = '';
  nombreLocalidad: string = '';
  localidades: any[] = [];
  campos: any[] = [];
  dataView: DataView[] = [
    {
      label: '',
      field: 'assets/img/Chacra_1.png',
      tipoLabel: TipoLabel.imagen,
    },
    { label: '', field: 'name', tipoLabel: TipoLabel.titulo },
    {
      label: 'Localidad',
      field: 'address.location.name',
      tipoLabel: TipoLabel.span,
    },
    { label: 'Hectarias', field: 'dimensions', tipoLabel: TipoLabel.span },
    { label: 'Descripción', field: 'observation', tipoLabel: TipoLabel.span },
    {
      label: 'campoSeleccionado',
      field: 'dashboard/lote',
      tipoLabel: TipoLabel.botonVerLote,
    },
    {
      label: 'campoSeleccionado',
      field: 'dashboard/detalle-campo',
      tipoLabel: TipoLabel.botonGeo,
    },
  ];
  campoData = {
    name: '',
    dimensions: '',
    geolocation: '',
    observation: '',
    address: {
      address: '',
      location: '',
    },
  }; 
  campoSeleccionado: any;
  contador: number = 0;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.campoData.geolocation = '';
    //aca pasamos los filtros y los botones, para que el componente dinamico los renderice
    // selectFilters y selectButton buscan esos filtros y los devuelven en un array
    this.filterConfigs = selectFilters([
      'LOCALIDAD',
      'NOMBRE_CHACRA',
      'FILTRO_SIN_INPUT_EJEMPLO' // este es para mostrarte como seria un ejemplo sin input, borra nomas despues
    ]);

    this.buttonConfigs = selectButtons([
      'REGISTRAR_CHACRAS', 
    ]);
    this.cargarCampos();
    this.cargarDatosDeUsuario();
    this.obtenerLocalidades();
  }

  newRanch() {
    this.router.navigate(['/dashboard/campo']);
  }

  BtnRegisterCampos(): void {
    this.router.navigate(['/dashboard/campo']);
  }

  cargarCampos() {
    if (!this.userLogeed?.userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    this.apiService.getFields(this.userLogeed?.userId).subscribe(
      (response) => {
        if (response.list && response.list.length > 0) {
          this.campos = response.list[0];

        } else {
          console.error('La lista de campos está vacía o no está definida');
        }
      },
      (error) => {
        console.error('Error al obtener campos:', error);
      }
    );
  }
  cargarDatosDeUsuario() {
    if (this.userLogeed!.userId == null) {
      this.apiService.getLocationMisiones('location').subscribe(
        (localidades) => {
          this.localidades = localidades;
          let nombreLocalidad: string = '';
          this.apiService
            .getPersonByIdProductor(
              this.userLogeed!.userId,
              this.userLogeed!.userId
            )
            .subscribe(
              (data) => {
                const localidad = this.localidades.find(
                  (loc) => loc.id === data.location.id
                );
                this.location = localidad ? localidad.name : null;
                this.nombreLocalidad = nombreLocalidad;
                this.nombre = data.name;
                this.apellido = data.lastname;
                this.dniCuit = data.dniCuit;
                this.descriptions = data.descriptions;
                this.telephone = data.telephone;
              },
              (error) => {
                console.error(
                  'Error al obtener nombre y apellido del usuario:',
                  error
                );
              }
            );
        },
        (error) => {
          console.error('Error al obtener las localidades', error);
        }
      );
    }
  }

  geolocalizar() {
    if (this.campoSeleccionado) {
      this.router.navigate(['dashboard/geolocalizacion'], {
        state: { campoSeleccionado: this.campoSeleccionado },
      });
    } else {
      this.toastr.warning('No se ha seleccionado ningún campo', 'Advertencia');
    }
  }

  registrarCampo(): void {
    if (!this.userLogeed?.userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }
    if (this.isValidForm()) {
      this.apiService
        .addField(this.userLogeed?.userId, this.campoData)
        .subscribe(
          () => {
            this.toastr.success('Campo registrado con éxito', 'Éxito');
            this.campoData = {
              name: '',
              dimensions: '',
              geolocation: '',
              observation: '',
              address: {
                address: '',
                location: '',
              },
            };
            this.router.navigate(['dashboard/geolocalizacion']);
          },
          (error) => {
            console.error('Error al registrar el campo:', error);
            if (error.error && error.error.message) {
              this.toastr.error(
                'Ya Existe un campo registrado con este nombre.',
                'Atención'
              );
            } else {
              this.toastr.error(
                'Error al registrar el campo. Detalles: ' + error.message,
                'Error'
              );
            }
          }
        );
    } else {
      this.toastr.error(
        'Por favor, completa todos los campos requeridos',
        'Error'
      );
    }
  }
  obtenerLocalidades() {
    this.apiService.getLocationMisiones('location').subscribe(
      (localidades) => {
        this.localidades = localidades;

      },
      (error) => {
        console.error('Error al obtener las localidades', error);
      }
    );
  }

  isValidForm(): boolean {
    const dimensions = Number(this.campoData.dimensions);
    const isAddressValid = this.campoData.address.address.trim() !== '';
    const isLocationValid = this.campoData.address.location.trim() !== '';
    const isNameValid = this.campoData.name.trim() !== '';
    const isObservationValid = this.campoData.observation.trim() !== '';
    const areDimensionsValid = !isNaN(dimensions) && dimensions > 0;

    return (
      isAddressValid &&
      isLocationValid &&
      isNameValid &&
      areDimensionsValid &&
      isObservationValid
    );
  }
  volver() {
    this.router.navigate(['dashboard/inicio']);
  }
  verLotes(campo: any): void {
    this.campoSeleccionado = campo;
    localStorage.setItem(
      'campoSeleccionado',
      JSON.stringify(this.campoSeleccionado)
    );
    this.router.navigate(['dashboard/lote']);
  }
  verMas(campo: any): void {
    this.campoSeleccionado = campo;
    localStorage.setItem(
      'campoSeleccionado',
      JSON.stringify(this.campoSeleccionado)
    );

    this.router.navigate(['dashboard/detalle-campo']);
  }

  clearFilter() {
    this.cargarCampos();
  }

  onFilter(filtro: any) { 
    const filterHandlers: { [key: string]: (value: any) => void } = {
      'Buscar por Localidad': (value) => this.filtrarPorLocalidad(value),
      'Buscar por Nombre de Chacra': (value) => this.filtrarPorNombreDeChacra(value),
      'Filtro sin input ejemplo': (value) => this.filtrarPorLocalidad(value), 
    };
    const handler = filterHandlers[filtro.type];
    
    if (handler) {
      handler(filtro.value);
    } else {
      console.warn(`No se encontró un manejador para el filtro tipo: ${filtro.type}`);
    }
  }

  filtrarPorLocalidad(buscar: string) { 
    if (!buscar || typeof buscar !== 'string') {
      this.toastr.error('Debe seleccionar una localidad', 'Error');
      return;
    }
    const buscarNormalizado = buscar.trim().toLowerCase();
    if (!this.localidades || this.localidades.length === 0) {
      this.toastr.error('No hay localidades disponibles para buscar', 'Error');
      return;
    }
    const localidadSeleccionada = this.localidades.find(
      (loc) => loc.name && loc.name.trim().toLowerCase() === buscarNormalizado
    );
    if (!localidadSeleccionada) {
      this.toastr.error('Localidad no encontrada', 'Error');
      return;
    }
    const locationId = localidadSeleccionada.id;

    const camposFiltrados = this.campos.filter(
      (campo) =>
        campo.address &&
        campo.address.location &&
        campo.address.location.id === locationId
    );

    if (camposFiltrados.length > 0) {

      this.campos = camposFiltrados;
    } else {
      this.toastr.info(
        'No se encontraron chacras con la localidad seleccionada',
        'Información'
      );
      this.clearCampos();
    }
  }

  filtrarPorNombreDeChacra(nombreChacra: string) {
    this.clearCampos();
    if (!nombreChacra || nombreChacra.trim() === '') {
      this.toastr.error('Debe ingresar un nombre de chacra', 'Error');
      return;
    }
    const palabrasClave = nombreChacra.trim().toLowerCase().split(/\s+/);

    if (!this.campos || this.campos.length === 0) {
      this.toastr.error('No hay chacras disponibles para buscar', 'Error');
      return;
    }
    const camposFiltrados = this.campos.filter((campo) => {
      const campoNombre = campo.name?.trim().toLowerCase();
      return palabrasClave.every((palabra) => campoNombre.includes(palabra));
    });
    if (camposFiltrados.length > 0) {
      
      this.campos = camposFiltrados;
    } else {
      this.toastr.info(
        'No se encontraron chacras con el nombre ingresado',
        'Información'
      );
      this.clearCampos();
    }
  }

  clearCampos() {
    this.campos = [];
    this.contador = 3;
    const intervalo = setInterval(() => {
      this.contador--;
      if (this.contador <= 0) {
        clearInterval(intervalo);
        this.clearFilter();
      }
    }, 1000);
  }
}
