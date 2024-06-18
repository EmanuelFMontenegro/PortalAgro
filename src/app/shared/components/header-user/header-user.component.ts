import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { ApiService } from 'src/app/services/ApiService';
import { jwtDecode } from 'jwt-decode'; // Importa jwtDecode correctamente

interface DecodedToken {
  userId: number;
  sub: string;
  name: string; // Agrega la propiedad 'name' si está presente en tu token
}

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.sass'],
})
export class HeaderUserComponent implements OnInit {
  @Input() name: string | null = null;
  @Input() email: string | null = null;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.decodeToken();
  }

  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded: DecodedToken = jwtDecode(token); // Ajusta el tipo según la estructura de tu token
      this.name = decoded.name;
      this.email = decoded.sub;
    } else {
      this.name = null;
      this.email = null;
    }
  }
}
