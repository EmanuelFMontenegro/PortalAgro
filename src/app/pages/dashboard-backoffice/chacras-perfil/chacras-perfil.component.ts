import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { TipoLabel, DataView } from 'src/app/shared/components/miniatura-listado/miniatura.model';

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
  selector: 'app-chacras-perfil',
  templateUrl: './chacras-perfil.component.html',
})
export class ChacrasPerfilComponent implements OnInit {
  chacraSeleccionada: any;
  private userId: number | any;
  private personId: number | any;
  nombre: string | null = null;
  apellido: string | null = null;
  email: string | null = null;
  contacto: string | null = null;
  public userEmail: string | null = null;
  chacras: any[] = [];
  options: string[] = [ 'Nombre', 'Hectareas'];
  dataView: DataView[] = [
    { label: '', field: 'assets/img/Chacra_1.png', tipoLabel: TipoLabel.imagen },
    { label: '', field: 'name', tipoLabel: TipoLabel.titulo },
    { label: 'Localidad', field: 'address.location.name', tipoLabel: TipoLabel.span },
    { label: 'Hectarias', field: 'dimensions', tipoLabel: TipoLabel.span },
    { label: 'Descripción', field: 'observation', tipoLabel: TipoLabel.span },
    { label: 'chacraSeleccionada', field: '/dashboard-backoffice/chacras-lote', tipoLabel: TipoLabel.botonVerLote },
    { label: 'chacraSeleccionada', field: '/dashboard-backoffice/detalle-chacra', tipoLabel: TipoLabel.botonGeo },

  ]
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const perfilDataChacra = localStorage.getItem('idPerfilProd');
    console.log("id del prod",perfilDataChacra)
    if (perfilDataChacra) {
      const userId = parseInt(perfilDataChacra);
      this.userId = userId;
      console.log("datos parsados",userId)
      this.cargarChacrasUsuario(userId);
      this.personId = userId;
      this.DatosUser(userId, this.personId);
    }
  }

  DatosUser(userId: number, personId: number) {
    console.log('Llamando a DatosUser con:', { userId, personId });
    this.apiService.getPersonByIdProductor(userId, personId).subscribe(
      (response: DatosUsuario) => {
        if (response) {
          console.log("datos del usario obtenido de idProd",response)
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

  cargarChacrasUsuario(userId: number) {
    this.apiService.getFields(userId).subscribe(
      (response) => {
        if (response && response.list && response.list.length > 0) {
          const listaChacras = response.list[0];
          this.chacras = listaChacras;

        } else {
          console.warn(
            'No se encontraron datos de chacras en la respuesta:',
            response
          );
          this.chacras = [];
          this.toastr.info(
            'El productor seleccionado no cuenta con chacras asociadas',
            'Atención !!!'
          );
          this.router.navigate(['dashboard-backoffice/cargar-chacras']);
        }
      },
      (error) => {
        console.error('Error al cargar las chacras del usuario:', error);
        this.chacras = [];
      }
    );
  }

  verMas(chacra: any): void {
    this.chacraSeleccionada = chacra;
    localStorage.setItem(
      'chacraSeleccionada',
      JSON.stringify(this.chacraSeleccionada)
    );

    this.router.navigate(['/dashboard-backoffice/detalle-chacra']);
  }

  BtnCargarChacra(): void {
    this.router.navigate(['/dashboard-backoffice/cargar-chacras']);
  }




  clearFilter() {
    this.cargarChacrasUsuario(this.userId);
  }

  onFilter(filtro: any) {
    switch (filtro.tipo) {
      case 'Buscar por Nombre de Chacra':
        this.filtrarPorNombreDeChacra(filtro.valor);
        break;
      case 'Buscar por Hectáreas':
        this.filtrarPorHectareas(filtro.min, filtro.max);
        break;
    }
  }
  filtrarPorHectareas(minHectareas: number, maxHectareas: number) {

    if (minHectareas === undefined || maxHectareas === undefined || isNaN(minHectareas) || isNaN(maxHectareas)) {
      console.error('Debe ingresar valores válidos para el rango de hectáreas');
      return;
    }
    // Convertir las cadenas de texto a números
    const minHectareasNum = minHectareas;
    const maxHectareasNum = maxHectareas;
    this.apiService
      .getUsersFields(
        0,
        5,
        'id',
        'desc',
        true,
        '',
        '',
        null,
        this.userId,
        minHectareasNum,
        maxHectareasNum
      ).subscribe(
        (response) => {
          if (response.list && response.list.length > 0) {
            this.chacras = response.list[0];
          } else {
            this.toastr.info(
              'No existen campos registrados dentro de este rango de hectáreas',
              'Información'
            );
            this.chacras = [];
          }
        },
        (error) => {
          console.error('Error al obtener campos:', error);
        }
      );
  }
  filtrarPorNombreDeChacra(nombreChacra: string) {
    if (!nombreChacra || nombreChacra.trim() === '') {
      console.error('Debe ingresar un nombre de chacra');
      return;
    }
    this.apiService
      .getUsersFields(0, 5, 'id', 'desc', true, '', nombreChacra, null,this.userId)
      .subscribe(
        (response) => {
          if (response.list && response.list.length > 0) {
            this.chacras = response.list[0];
          } else {
            this.toastr.info(
              'No existen campos registrados con este nombre de chacra',
              'Información'
            );
            this.chacras = [];
          }
        },
        (error) => {
          console.error('Error al obtener campos:', error);
        }
      );
  }
}
