import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { DashboardBackOfficeService } from '../../dashboard-backoffice.service';

interface DataForm {
  type: 'text' | 'file' | 'select' | 'password' | 'textarea' | 'checkbox';
  placeholder: string;
  ngModel: string;
  name: string;
  value?: any;
  multiple?: boolean;
  options?: { value: any; text: string }[];
  onChange?: (event: any) => void;
  readonly?: boolean;
}
interface Department {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  userResponseDTO: UserResponseDTO;
  departmentAssigned?: Department[];
  company?: any;
  typeUser?: string;
  provinciasAsignadas?: string;
  departamentosAsignados?: string;
  color?: string;
  [key: string]: any;
}
interface UserResponseDTO {
  username?: string;
  name?: string;
  role?: Role;
  company?: any;
  [key: string]: any;
}

interface Role {
  id: number;
  name: string;
  permissions: any[];
  typeRole: number;
  active: boolean;
  [key: string]: any;
}

@Component({
  selector: 'app-usuarios-actualizar',
  templateUrl: './usuarios-actualizar.component.html',
  styleUrls: ['./usuarios-actualizar.component.sass'],
})
export class UsuariosActualizarComponent implements OnInit {
  item: any; // Adjust type according to your needs
  separatorKeysCodes: number[] = [
    /* Define your separator key codes */
  ];
  formSubmitted: EventEmitter<any> = new EventEmitter<any>();
  departments: Department[] = [];
  dataForm: DataForm[] = [];
  formData: Partial<User> = {
    userResponseDTO: {
      username: '',
      name: '',
      role: {
        id: 0,
        name: '',
        permissions: [],
        typeRole: 0,
        active: false,
      },
      company: {},
    },
    departmentAssigned: [],
    account_active: false,
    typeUser: '',
    provinciasAsignadas: '',
    departamentosAsignados: '',
    color: '',
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
    const userType = localStorage.getItem('UserType');
    if (userType) {
      const userTypeObject = JSON.parse(userType);
      const userRole = userTypeObject.typeUser;
      console.log('UserRole:', userRole);

      if (userRole === 'manager') {
        this.getUserManager();
      } else {
        this.getAllUserTypes();
      }
    } else {
      this.toastr.error('No se encontró UserType en el almacenamiento local.');
    }

    this.loadDepartments();
  }

  getUserManager() {
    const userType = localStorage.getItem('UserType');
    if (userType) {
      const userTypeObject = JSON.parse(userType);
      const userId = userTypeObject.id;

      this.apiService.getManagerById(userId).subscribe(
        (userDetails: any) => {
          console.log(
            'Datos recibidos del API para llenar el formulario:',
            userDetails
          );
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

  getAllUserTypes() {
    const userType = localStorage.getItem('UserType');
    if (userType) {
      const userTypeObject = JSON.parse(userType);
      const userId = userTypeObject.id;
      const tipoUser = userTypeObject.typeUser.toLowerCase();

      if (tipoUser === 'manager') {
        this.getUserManager();
      } else if (
        tipoUser === 'technical' ||
        tipoUser === 'operator' ||
        tipoUser === 'cooperative'
      ) {
        this.apiService.getUserByRoleAndId(tipoUser, userId).subscribe(
          (userDetails: any) => {
            console.table('Datos de otros perfiles', userDetails);
            this.fillFormData(userDetails);
          },
          (error) => {
            console.error('Error al obtener usuario:', error);
            if (error.status === 404) {
              this.toastr.error('Usuario no encontrado');
            } else {
              this.toastr.error('Error al obtener usuario');
            }
          }
        );
      } else {
        console.error(
          `Tipo de usuario no válido para esta operación: ${tipoUser}`
        );
        this.toastr.error('Tipo de usuario no válido para esta operación');
      }
    } else {
      this.toastr.error('No se encontró UserType en el almacenamiento local.');
    }
  }

  fillFormData(userDetails: any) {
    // Llenar los datos principales del usuario
    this.formData = {
      id: userDetails.id,
      name: userDetails.name || '',
      lastname: userDetails.lastname || '',
      dni: userDetails.dni || '',
      departmentAssigned: userDetails.departmentAssigned || [],

      function: userDetails.function || '',
      specialty: userDetails.specialty || '',
      matricula: userDetails.matricula || '',

      license: userDetails.license || '',
      urlImageLicense: userDetails.urlImageLicense || '',

      userResponseDTO: {
        username: userDetails.user.username || '',
        name: userDetails.user.name || '',
        role: {
          id: userDetails.user.role.id || 0,
          name: userDetails.user.role.name || '',
          permissions: userDetails.user.role.permissions || [],
          typeRole: userDetails.user.role.typeRole || 0,
          active: userDetails.user.role.active || false,
        },
        company: userDetails.user.company || {},
      },
    };

    // Actualizar campos adicionales si es necesario
    this.actualizarCamposFormulario();
  }

  loadDepartments() {
    this.apiService.getAllDepartments().subscribe(
      (departments: Department[]) => {
        this.departments = departments;
        console.log('Departamentos cargados correctamente:', this.departments);
      },
      (error) => {
        console.error('Error al obtener departamentos:', error);
        this.toastr.error('Error al obtener departamentos');
      }
    );
  }

  updateFormData() {
    this.formSubmitted.emit(this.formData);
  }

  getDescripcionDepartament(
    idDepartament: number,
    listadoDepartament: Department[]
  ): string {
    const departamento = listadoDepartament.find(
      (dep) => dep.id === idDepartament
    );
    return departamento ? departamento.name : '';
  }

  addDepartment(event: MatChipInputEvent, modelName: string): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.formData.departmentAssigned = this.formData.departmentAssigned || [];
      this.formData.departmentAssigned.push({
        id: 0,
        name: value.trim(),
      });
    }

    if (input) {
      input.value = '';
    }

    this.updateFormData();
  }

  removeDepartment(department: string, modelName: string) {
    this.formData[modelName] = this.formData[modelName].filter(
      (dep: string) => dep !== department
    );
    this.updateFormData();
  }

  updateSelectedDepartments(event: any, ngModel: string): void {
    this.formData.departmentAssigned = event.value.map((depId: number) => ({
      id: depId,
      name: this.getDescripcionDepartament(depId, this.departments),
    }));
  }

  actualizarCamposFormulario() {
    const userType = localStorage.getItem('UserType');
    if (userType) {
      const userTypeObject = JSON.parse(userType);
      const userRole = userTypeObject.typeUser;

      const fields: DataForm[] = [
        {
          type: 'text',
          placeholder: 'Nombre',
          ngModel: 'formData.name',
          name: 'name',
        },
        {
          type: 'text',
          placeholder: 'Apellido',
          ngModel: 'formData.lastname',
          name: 'lastname',
        },
        {
          type: 'text',
          placeholder: 'DNI',
          ngModel: 'formData.dni',
          name: 'dni',
        },
        {
          type: 'select',
          placeholder: 'Departamento Asignado',
          ngModel: 'formData.departmentAssigned',
          name: 'departmentAssigned',
          multiple: true,
          options: Array.isArray(this.departments)
            ? this.departments.map((dept) => ({
                value: dept.id,
                text: dept.name,
              }))
            : [],
        },

        {
          type: 'text',
          placeholder: 'Función',
          ngModel: 'formData.function',
          name: 'function',
        },
        {
          type: 'text',
          placeholder: 'Especialidad',
          ngModel: 'formData.specialty',
          name: 'specialty',
        },
        {
          type: 'text',
          placeholder: 'Matrícula',
          ngModel: 'formData.matricula',
          name: 'matricula',
        },

        {
          type: 'text',
          placeholder: 'Licencia',
          ngModel: 'formData.license',
          name: 'license',
        },

        {
          type: 'text',
          placeholder: 'Username',
          ngModel: 'formData.userResponseDTO.username',
          name: 'userResponseDTO.username',
        },
      ];

      this.dataForm = fields.filter((field) => {
        if (
          userRole === 'operator' &&
          field.name !== 'function' &&
          field.name !== 'specialty' &&
          field.name !== 'matricula' &&
          field.name !== 'urlImageMatricula' &&
          field.name !== 'license' &&
          field.name !== 'urlImageLicense'
        ) {
          return false;
        }
        return true;
      });
    }
  }

  enviarFormulario() {
    const {
      id,
      name,
      lastname,
      dni,
      userResponseDTO,
      password,
      confirmPassword,
    } = this.formData;
    const userResponseDTOData = userResponseDTO || {};

    const roleName = userResponseDTOData.role?.name || '';
    console.log('Role before normalization:', roleName); // Log

    const userData: any = {
      username: userResponseDTOData.username || '',
      name,
      lastname,
      dni,
      company_id: this.formData.company?.id || 1,
    };

    // Actualizar datos del usuario
    this.apiService.updateManagerDetails(id!, userData).subscribe(
      (response) => {
        this.toastr.success('Datos actualizados exitosamente');
        this.router.navigate(['dashboard-backoffice/usuarios-filtro']);

        if (password && confirmPassword) {
          this.updateManagerPassword(id!, password, confirmPassword);
        }
      },
      (error) => {
        console.error('Error al actualizar datos:', error);

        const errorCode = error?.error?.code;
        const errorDetails = error?.error?.listDetails;

        // Verifica los códigos de error específicos
        if (errorCode === 998) {
          this.toastr.error(
            'El usuario que desea crear ya existe. Prueba con otro email.'
          );
        } else if (errorCode === 4012 && errorDetails?.dni) {
          this.toastr.error(
            'Error al cargar el DNI: ' + errorDetails.dni,
            'Atención'
          );
        } else {
          this.toastr.error('Error al actualizar datos');
        }
      }
    );
  }

  private updateManagerPassword(
    managerId: number,
    password: string,
    confirmPassword: string
  ) {
    const requestData = {
      password,
      confirmPassword,
    };

    this.apiService
      .updateManagerPassword(managerId, password, confirmPassword)
      .subscribe(
        (response) => {
          this.toastr.success('Contraseña actualizada exitosamente');
        },
        (error) => {
          console.error('Error al actualizar contraseña:', error);
          this.toastr.error('Error al actualizar contraseña');
        }
      );
  }

  cancelar() {
    this.resetearFormulario();
    this.router.navigate(['dashboard-backoffice/usuarios-filtro']);
  }

  resetearFormulario() {
    this.formData = {};
    this.dataForm = [];
  }

  getNestedValue(path: string): any {
    return path
      .split('.')
      .reduce((prev, curr) => prev && prev[curr], this.formData);
  }

  setNestedValue(path: string, value: any): void {
    const keys = path.split('.');
    let obj = this.formData;
    keys.slice(0, -1).forEach((key) => (obj = obj[key] || (obj[key] = {})));
    obj[keys[keys.length - 1]] = value;
  }
}
