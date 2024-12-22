import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TravelService } from './travelService.service';
import { ToastrService } from 'ngx-toastr';


interface Servicio {
  nro: number;
  id: number;
  productor: string;
  localidad: string;
  cultivo: string;
  estado: string;
  selected?: boolean;
  geolocation?: string;
  withWater?: boolean;
}
interface DetalleRuta {
  productor: string;
  chacra: number;
  localidad: string;
  ubicacion: string;
  agua: string;
}

interface Insumo {
  name: string;
  quantity: number;
}

@Component({
  selector: 'app-planificaciones',
  templateUrl: './planificaciones.component.html',
  styleUrls: ['./planificaciones.component.sass'],
})
export class PlanificacionesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  itemsPerPage: number = 6;
  page: number = 1;
  servicios: Servicio[] = [];
  serviciosSeleccionados: Servicio[] = [];
  insumosTotales: Insumo[] = [];
  detallesRuta: DetalleRuta[] = [];
  displayedColumns: string[] = [
    'productor',
    'localidad',
    'cultivo',
    'estado',
    'seleccionar',
  ];
  dataSource = new MatTableDataSource<Servicio>(this.servicios);

  constructor(
    private travelService: TravelService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  onPageChange(page: number): void {
    this.page = page;
  }

  cargarServicios(): void {
    this.travelService.getServicesForTravel('id', 'DESC', 10, 0).subscribe(
      (response) => {
        if (response?.list?.[0]) {
          this.servicios = response.list[0].map(
            (servicio: any, index: number) => ({
              nro: index + 1,
              id: servicio.id,
              productor: servicio.producer.lastname || 'No definido',
              localidad: servicio.location?.name || 'No definido',
              cultivo: servicio.jobTechnical?.typeCrop?.name || 'No definido',
              estado: servicio.status?.name || 'No definido',
              geolocation: servicio.field?.geolocation || 'No definido',
              withWater: servicio.jobTechnical?.withWater || false,
              selected: false,
            })
          );
          this.dataSource.data = this.servicios;
        } else {
          this.servicios = [];
          this.dataSource.data = [];
        }
      },
      () => {
        this.toastr.error('Error al cargar los servicios', 'Error');
      }
    );
  }

  seleccionarServicio(event: any, servicio: Servicio): void {
    const index = this.servicios.findIndex((s) => s.id === servicio.id);
    if (index !== -1) {
      this.servicios[index].selected = event.checked;
      if (event.checked) {
        this.serviciosSeleccionados.push(servicio);

        // Agregar detalles reales al acordeón
        const existe = this.detallesRuta.some(
          (detalle) => detalle.chacra === servicio.id
        );
        if (!existe) {
          this.detallesRuta.push({
            productor: servicio.productor,
            chacra: servicio.id,
            localidad: servicio.localidad,
            ubicacion: servicio.geolocation || 'No definido',
            agua: servicio.withWater ? 'Sí' : 'No',
          });
        }
      } else {
        this.serviciosSeleccionados = this.serviciosSeleccionados.filter(
          (s) => s.id !== servicio.id
        );
        this.detallesRuta = this.detallesRuta.filter(
          (detalle) => detalle.chacra !== servicio.id
        );
      }
    }
  }

  actualizarInsumosTotales(): void {
    const serviceIds = this.serviciosSeleccionados.map((s) => s.id).join(',');
    if (!serviceIds) {
      this.insumosTotales = [];
      this.cdr.detectChanges();
      return;
    }

    this.travelService.getSuppliesForServices(serviceIds).subscribe(
      (response) => {
        if (
          response?.totalProductInput &&
          Object.keys(response.totalProductInput).length > 0
        ) {
          this.insumosTotales = Object.entries(response.totalProductInput).map(
            ([name, quantity]) => ({
              name,
              quantity: Number(quantity),
            })
          );
        } else {
          this.insumosTotales = [];
        }
        this.cdr.detectChanges();
      },
      () => {
        this.toastr.error('Error al obtener los insumos', 'Error');
      }
    );
  }

  crearRuta(): void {
    this.actualizarInsumosTotales();
    this.detalleRuta();
  }

  limpiarSeleccion(): void {
    this.serviciosSeleccionados = [];
    this.insumosTotales = [];
    this.servicios.forEach((servicio) => {
      servicio.selected = false;
    });

    this.detallesRuta = [];

    this.cdr.detectChanges();
  }

  detalleRuta(): void {
    if (this.serviciosSeleccionados.length === 0) {
      this.toastr.warning(
        'No hay servicios seleccionados para crear la ruta',
        'Advertencia'
      );
      return;
    }

    this.serviciosSeleccionados.forEach((servicio) => {
      const existe = this.detallesRuta.some(
        (detalle) => detalle.chacra === servicio.id
      );
      if (!existe) {
        this.detallesRuta.push({
          productor: servicio.productor,
          chacra: servicio.id,
          localidad: servicio.localidad,
          ubicacion: 'Coordenadas no disponibles',
          agua: Math.random() > 0.5 ? 'Sí' : 'No',
        });
      }
    });

    this.toastr.info('Detalles de la ruta generados', 'Info');
  }
}
