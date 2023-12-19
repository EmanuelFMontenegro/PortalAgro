import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  userId: number;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.sass']
})
export class InicioComponent implements OnInit {
  userEmail: string = '';
  userId: number | null = null;
  campoData = {
    name: '',
    dimensions: '',
    description: '',
    address: {
      address: '',
      location: ''
    }
  };

  addressTouched = false;
  locationTouched = false;
  nameTouched = false;
  dimensionsTouched = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.decodeToken();
    console.log('numero de usuario', this.userId);
  }

  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this.userId = decoded.userId;
    }
  }

  registrarCampo(): void {
    if (!this.userId) {
      this.toastr.error('Error: No se ha identificado al usuario.', 'Error');
      return;
    }

    if (this.isValidForm()) {
      this.apiService.addField(this.userId, this.campoData).subscribe(
        () => {
          this.toastr.success('Campo registrado con éxito', 'Éxito');
          this.router.navigate(['/geolocalizacion']);
        },
        error => {
          console.error('Error al registrar el campo:', error);
          this.toastr.error('Error al registrar el campo. Detalles: ' + error.message, 'Error');
        }
      );
    } else {
      this.toastr.error('Por favor, completa todos los campos requeridos', 'Error');
    }
  }

  isValidForm(): boolean {
    const dimensions = Number(this.campoData.dimensions);

    const isAddressValid = this.campoData.address.address.trim() !== '';
    const isLocationValid = this.campoData.address.location.trim() !== '';
    const isNameValid = this.campoData.name.trim() !== '';
    const areDimensionsValid = !isNaN(dimensions) && dimensions > 0;

    return isAddressValid && isLocationValid && isNameValid && areDimensionsValid;
  }
}
