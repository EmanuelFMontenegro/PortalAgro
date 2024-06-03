import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chacras-perfil',
  templateUrl: './chacras-perfil.component.html',
  styleUrls: ['./chacras-perfil.component.sass'],
})
export class ChacrasPerfilComponent implements OnInit {
  private userId: number | any;
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
    }
  }

  cargarChacrasUsuario(userId: number) {
    this.apiService.getFields(userId).subscribe(
      (response) => {
        if (response && response.list && response.list.length > 0) {
          const listaChacras = response.list[0];
          this.chacras = listaChacras;
          console.table("datos de chacra de usuario perfil", this.chacras);
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
          this.router.navigate(['dashboard-backoffice/perfil-productor']);
        }
      },
      (error) => {
        console.error('Error al cargar las chacras del usuario:', error);
        this.chacras = [];
      }
    );
  }

  verMas(campo: any) {
    // Lógica para ver más detalles sobre un campo específico
  }
}
