import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { DashboardBackOfficeService } from '../../dashboard-backoffice.service';

interface DataForm {
  type: 'text' | 'file' | 'select' | 'password' | 'textarea' | 'checkbox';
  placeholder: string;
  ngModel: string;
  name: string;
}

interface User {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  userResponseDTO: UserResponseDTO;
  departmentAssigned?: any[];
  account_active?: boolean;
  company?: any;
  typeUser?: string;
  provinciasAsignadas?: string;
  departamentosAsignados?: string;
  color?: string;
  [key: string]: any;
}

interface UserResponseDTO {
  id: number;
  username: string;
  email: string;
  account_active: boolean;
  accountNonLocked: boolean;
  failedAttempts: number;
  lockeTime: any; // Ajusta este tipo según el tipo real en tu API
  role: Role;
  [key: string]: any;
}

interface Role {
  name: string;
  [key: string]: any;
}

@Component({
  selector: 'app-usuarios-actualizar',
  templateUrl: './usuarios-actualizar.component.html',
  styleUrls: ['./usuarios-actualizar.component.sass'],
})
export class UsuariosActualizarComponent implements OnInit {
  dataForm: DataForm[] = [];
  formData: Partial<User> = {
    userResponseDTO: {
      id: 0,
      username: '',
      email: '',
      account_active: false,
      accountNonLocked: true,
      failedAttempts: 0,
      lockeTime: null,
      role: {
        name: '',
      },
    },
  };

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService,
    public dashboardBackOffice: DashboardBackOfficeService
  ) {
    this.dashboardBackOffice.dataTitulo.next({
      titulo: '¡Acá podrás Actualizar a los usuarios del Sistema!',
      subTitulo: '',
    });
  }

  ngOnInit(): void {
    this.getUserManager();
  }

  getUserManager() {
    const userType = localStorage.getItem('UserType');
    if (userType) {
      const userTypeObject = JSON.parse(userType);
      const userId = userTypeObject.id;

      this.apiService.getManagerById(userId).subscribe(
        (userDetails: any) => {
          console.log(
            'Datos del usuario Manager obtenidos con el Enpoint:',
            userDetails
          ); // Log de detalles del usuario obtenidos
          this.fillFormData(userDetails);
        },
        (error) => {
          console.error('Error al obtener usuario:', error);
          this.toastr.error('Error al obtener usuario');
        }
      );
    } else {
      this.toastr.error('No se encontró UserType en el almacenamiento local.');
    }
  }

  fillFormData(userData: any) {
    this.formData = {
      id: userData.id || null,
      name: userData.name || '',
      lastname: userData.lastname || '',
      dni: userData.dni || '',
      userResponseDTO: {
        id: userData.userResponseDTO?.id || 0,
        username: userData.userResponseDTO?.username || '',
        email: userData.userResponseDTO?.email || '',
        account_active: userData.userResponseDTO?.account_active || false,
        accountNonLocked: userData.userResponseDTO?.accountNonLocked || true,
        failedAttempts: userData.userResponseDTO?.failedAttempts || 0,
        lockeTime: userData.userResponseDTO?.lockeTime || null,
        role: {
          name: userData.userResponseDTO?.role?.name || '',
        },
      },
      departmentAssigned: userData.departmentAssigned || [],
      account_active: userData.account_active || false,
      company: userData.company || {},
      typeUser: userData.typeUser || '',
      provinciasAsignadas: userData.provinciasAsignadas || '',
      departamentosAsignados: userData.departamentosAsignados || '',
      color: userData.color || '',
    };

    // Verificar contenido de formData
    console.log(
      'Datos del usuario en formData que se manda al formulario:',
      this.formData
    );

    this.actualizarCamposFormulario();
  }

  actualizarCamposFormulario() {
    this.dataForm = [
      { type: 'text', placeholder: 'Nombre', ngModel: 'name', name: 'name' },
      {
        type: 'text',
        placeholder: 'Apellido',
        ngModel: 'lastname',
        name: 'lastname',
      },
      { type: 'text', placeholder: 'DNI', ngModel: 'dni', name: 'dni' },
      {
        type: 'text',
        placeholder: 'Email',
        ngModel: 'userResponseDTO.email',
        name: 'email',
      }, // Campo para el email del usuario manager
    ];

    // Verificar configuración de dataForm
    console.log('Configuración de dataForm actualizado:', this.dataForm);
  }

  enviarFormulario() {
    console.log('Formulario enviado:', this.formData);
    // Implementa lógica para enviar formulario al API
  }

  cancelar() {
    this.resetearFormulario();
    this.router.navigate(['dashboard-backoffice/usuarios-filtro']);
  }

  resetearFormulario() {
    this.formData = {};
    this.dataForm = [];
  }
}
