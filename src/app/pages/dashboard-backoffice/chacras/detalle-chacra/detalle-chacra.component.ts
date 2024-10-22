import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/ApiService';
import * as L from 'leaflet';



interface DatosUsuario {
  accept_license: boolean;
  account_active: boolean;
  canEdit: boolean | null;
  descriptions: string;
  dni: string;
  id: number;
  lastname: string;
  location: { id: number; name: string; department_id: number };
  name: string;
  telephone: string;
  username: string;
}
@Component({
  selector: 'app-detalle-chacra',
  templateUrl: './detalle-chacra.component.html',
  styleUrls: ['./detalle-chacra.component.scss'],
})
export class DetalleChacraComponent implements OnInit, AfterViewInit {
  public userEmail: string | null = null;
  private userId: number | any;
  private personId: number | any;
  nombre: string | null = null;
  apellido: string | null = null;
  email: string | null = null;
  contacto: string | null = null;
  public chacraSeleccionada: any = {};
  mostrarMapaPrincipal: boolean = false;
  mostrarImagenPrincipal: boolean = false;

  constructor
    (private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router) {}

  ngOnInit(): void {
    const perfilDataChacra = localStorage.getItem('idPerfilProd');
    if (perfilDataChacra) {
      const userId = parseInt(perfilDataChacra);
      this.personId = userId;
      this.DatosUser(userId, this.personId);
    }
    const chacraSeleccionadaParam = localStorage.getItem('chacraSeleccionada');
    if (chacraSeleccionadaParam) {
      this.chacraSeleccionada = JSON.parse(chacraSeleccionadaParam);
      if (this.chacraSeleccionada.geolocation) {
        this.mostrarMapaPrincipal = true;
      } else {
        this.mostrarImagenPrincipal = true;
        this.toastr.warning(
          'Tu campo no se encuentra geolocalizado',
          'Atencion'
        );
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.mostrarMapaPrincipal) {
      this.mostrarMapa();
    }
  }

  mostrarMapa(): void {
    if (this.chacraSeleccionada.geolocation) {
      const mapElement = document.getElementById('map');
      if (mapElement) {
        const geolocationData = this.chacraSeleccionada.geolocation.split(',').map(parseFloat);
        const latitude = geolocationData[0];
        const longitude = geolocationData[1];
        const map = L.map(mapElement).setView([latitude, longitude], 15);
        L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(map);
        L.marker([latitude, longitude]).addTo(map).bindPopup('Ubicación del campo').openPopup();

      }
    }
  }

  DatosUser(userId: number, personId: number) {
    this.apiService.getPersonByIdProductor(userId, personId).subscribe(
      (response: DatosUsuario) => {
        if (response) {
          this.nombre = response.name;
          this.apellido = response.lastname;
          this.email = response.username;
          this.contacto = response.telephone;
        } else {
          console.warn(
            'No se encontraron datos de la persona en la respuesta:',
            response
          );
        }
      },
      (error) => {
        console.error('Error al obtener los datos de la persona:', error);
      }
    );
  }

  geolocalizar() {
    if (this.chacraSeleccionada) {
      localStorage.setItem(
        'chacraSeleccionada',
        JSON.stringify(this.chacraSeleccionada)
      );
      this.router.navigate(['/dashboard-backoffice/chacras-geolocalizar']);
    } else {
      this.toastr.warning('No se ha seleccionado ningún campo', 'Advertencia');
    }
  }

  volver() {
    this.router.navigate(['dashboard-backoffice/chacras-perfil']);
  }

  verLotes() {
    this.router.navigate(['dashboard-backoffice/chacras-lote']);
  }

  cancelar() {
    this.router.navigate(['dashboard-backoffice/inicio']);
  }
}
