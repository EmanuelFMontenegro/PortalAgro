import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-usuarios-filtro',
  templateUrl: './usuarios-filtro.component.html',
  styleUrls: ['./usuarios-filtro.component.sass']
})
export class UsuariosFiltroComponent {

  constructor(private router: Router) {

}
BtnCrearUsuarios(){
  this.router.navigate(['dashboard-backoffice/usuarios']);
}
}
