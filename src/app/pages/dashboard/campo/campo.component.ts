import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { FormConfig } from 'src/app/models/field.interface';
import { getFormConfig } from 'src/app/shared/components/dynamic-form/dynamic-form.config';

interface CustomJwtPayload {
  userId: number;
  sub: string;
}

@Component({
  selector: 'app-campo',
  templateUrl: './campo.component.html',
})
export class CampoComponent implements OnInit {
  formConfig!: FormConfig;

  localidades: any[] = [];
  private userId: number | any;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.formConfig = getFormConfig('REGISTRO_CHACRA');
  }

  ngOnInit(): void {
    this.decodeToken();
    this.obtenerLocalidades();
  }

  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this.userId = decoded.userId;
    }
  }

  obtenerLocalidades() {
    this.apiService.getLocationMisiones('location').subscribe(
      (localidades) => {
        this.localidades = localidades;
        this.formConfig.fields[1].options = [...this.localidades];
      },
      (error) => {
        console.error('Error al obtener las localidades', error);
      }
    );
  }

  onFormSubmit(formData: any) {
    const campoData = {
      ...formData,
      geolocation: '',
      address: {
        address: formData.address,
        location_id: formData.localidad
      }
    };

    this.apiService.addField(this.userId, campoData).subscribe(
      () => {
        this.toastr.success('Campo registrado con éxito', 'Éxito');
        this.router.navigate(['dashboard/chacras']);
      },
      (error) => {
        this.toastr.error('Error al registrar el campo', 'Error');
      }
    );
  }

  onCancel() {
    this.router.navigate(['dashboard/chacras']);
  }
  

}
