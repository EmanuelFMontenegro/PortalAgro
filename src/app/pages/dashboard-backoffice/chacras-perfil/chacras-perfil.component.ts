import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';

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
  styleUrls: ['./chacras-perfil.component.sass'],
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

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const perfilDataChacra = localStorage.getItem('idPerfilProd');
    if (perfilDataChacra) {
      const userId = parseInt(perfilDataChacra);
      this.cargarChacrasUsuario(userId);
      this.personId = userId;
      this.DatosUser(userId, this.personId);
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
}
