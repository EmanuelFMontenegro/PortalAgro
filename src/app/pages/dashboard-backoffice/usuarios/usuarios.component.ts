import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';

interface DataForm {
  type: 'text' | 'file' | 'select' | 'password' | 'textarea' | 'checkbox';
  placeholder: string;
  ngModel: string;
  name: string;
  options?: { value: any; text: string }[];
  readonly?: boolean;
}

enum TipoUsuarios {
  tecnico = 'Técnico General',
  piloto = 'Piloto de Dron',
  cooperativa = 'Cooperativa',
  gerente = 'Gerente General',
  administrador = 'Administrador',
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.sass'],
})
export class UsuariosComponent implements OnInit {
  opciones = [
    TipoUsuarios.administrador,
    TipoUsuarios.gerente,
    TipoUsuarios.cooperativa,
    TipoUsuarios.tecnico,
    TipoUsuarios.piloto,
  ];
  selectedForm = TipoUsuarios.administrador;

  dataForm: DataForm[] = [];
  formData: any = {
    username: '',
    password: '',
    role: 4
  };


  imgMatriculaFile: File | null = null;
  imgLicenciaFile: File | null = null;
  fotoFile: File | null = null;

  empresas = [
    { value: 1, text: 'AgroSustentable S.A' },
    { value: 2, text: 'Otra Empresa' },
  ];

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  ngOnInit() {
    this.seleccionoTipo();
  }

  seleccionoTipo() {
    this.dataForm = [
      {
        type: 'text',
        placeholder: 'Email',
        ngModel: 'username',
        name: 'username',
      },
      {
        type: 'password',
        placeholder: 'Contraseña',
        ngModel: 'password',
        name: 'password',
      },
      { type: 'text', placeholder: 'Nombre', ngModel: 'name', name: 'name' },
      {
        type: 'text',
        placeholder: 'Apellido',
        ngModel: 'lastname',
        name: 'lastname',
      },
      { type: 'text', placeholder: 'DNI', ngModel: 'dni', name: 'dni' },
      {
        type: 'textarea',
        placeholder: 'Descripción',
        ngModel: 'description',
        name: 'description',
      },
    ];

    switch (this.selectedForm) {
      case TipoUsuarios.tecnico:
      case TipoUsuarios.piloto:
        this.dataForm.push(
          {
            type: 'text',
            placeholder: 'Departamento Asignado',
            ngModel: 'departmentAssigned',
            name: 'departmentAssigned',
          },
          {
            type: 'text',
            placeholder: 'Función',
            ngModel: 'function',
            name: 'function',
          },
          {
            type: 'text',
            placeholder: 'Especialidad',
            ngModel: 'specialty',
            name: 'specialty',
          },
          {
            type: 'text',
            placeholder: 'Matrícula',
            ngModel: 'matricula',
            name: 'matricula',
          },
          {
            type: 'file',
            placeholder: 'Subir Matrícula',
            ngModel: 'imgMatricula',
            name: 'imgMatricula',
          },
          {
            type: 'text',
            placeholder: 'Licencia',
            ngModel: 'license',
            name: 'license',
          },
          {
            type: 'file',
            placeholder: 'Subir Licencia',
            ngModel: 'imgLicencia',
            name: 'imgLicencia',
          }
        );
        break;

      case TipoUsuarios.gerente:
      case TipoUsuarios.administrador:
        this.dataForm.push({
          type: 'select',
          placeholder: 'Empresa',
          ngModel: 'company_id',
          name: 'company_id',
          options: this.empresas,
        });
        this.formData.company_id = 1; // ID de la compañía predeterminado: Agrosustentable
        this.formData.role = 4; // Rol específico para administrador
        break;

      case TipoUsuarios.cooperativa:
        this.dataForm.push(
          { type: 'text', placeholder: 'CUIT', ngModel: 'cuit', name: 'cuit' },
          {
            type: 'text',
            placeholder: 'Razón Social',
            ngModel: 'razonSocial',
            name: 'razonSocial',
          },
          {
            type: 'text',
            placeholder: 'Dirección',
            ngModel: 'address',
            name: 'address',
          },
          {
            type: 'text',
            placeholder: 'Departamento Asignado',
            ngModel: 'departmentAssigned',
            name: 'departmentAssigned',
          },
          {
            type: 'text',
            placeholder: 'Función',
            ngModel: 'function',
            name: 'function',
          }
        );
        this.formData.role = 6; // Rol para Cooperativa
        break;
    }
  }

  onFileChange(event: any, field: string) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (field === 'imgMatricula') {
        this.imgMatriculaFile = file;
      } else if (field === 'imgLicencia') {
        this.imgLicenciaFile = file;
      } else if (field === 'foto') {
        this.fotoFile = file;
      }
    }
  }

  onFormSubmitted(formData: any) {
    this.formData = formData;
  }

  enviarFormulario() {
    const formData: any = { ...this.formData };

    // Asegurarse de que departmentAssigned sea un array de números si es necesario
    if (
      formData.departmentAssigned &&
      !Array.isArray(formData.departmentAssigned)
    ) {
      formData.departmentAssigned = formData.departmentAssigned
        .split(',')
        .map(Number);
    }

    this.dataForm.forEach((field) => {
      formData[field.ngModel] = this.formData[field.ngModel];
    });

    formData.departmentAssigned = [12, 7]; // Asignación harcodeada
    formData.role = 4; // Asignación del rol número 4 para administrador

    if (
      this.selectedForm === TipoUsuarios.gerente ||
      this.selectedForm === TipoUsuarios.administrador
    ) {
      formData.company_id = this.formData.company_id;
      formData.isPreActivate = true;
      formData.autogeneratePass = false;
    }

    if (this.selectedForm === TipoUsuarios.cooperativa) {
      formData.role = 6; // Asignar el rol 6 para cooperativa
      formData.isPreActivate = false;
      formData.autogeneratePass = false;
      formData.departmentAssigned = [20, 22]; // Ejemplo de asignación para cooperativa
    }

    // Limpiar campos username y password
    formData.username = '';
    formData.password = '';

    console.log('Formulario enviado:', formData);
    this.apiService.registrarTecnico(formData).subscribe(
      (response) => {
        console.log('Usuario registrado:', response);

        if (this.imgLicenciaFile) {
          this.apiService
            .subirImagenLicencia(response.id, this.imgLicenciaFile)
            .subscribe((respLic) => {
              console.log('Imagen de licencia subida:', respLic);
            });
        }

        if (this.imgMatriculaFile) {
          this.apiService
            .subirImagenMatricula(response.id, this.imgMatriculaFile)
            .subscribe((respMat) => {
              console.log('Imagen de matrícula subida:', respMat);
            });
        }

        this.toastr.success('Usuario registrado exitosamente');
      },
      (error) => {
        console.error('Error al registrar usuario:', error);
        if (error.status === 400 && error.error && error.error.code === 4002) {
          this.toastr.error(
            'El usuario que intenta registrar ya está registrado'
          );
        } else if (error.status === 403) {
          this.toastr.error(
            'No tienes permisos suficientes para crear usuarios. Por favor, contacta a tu administrador.'
          );
        } else {
          this.toastr.error(
            'Error al registrar usuario. Por favor, intente más tarde'
          );
        }
      }
    );
  }

  cancelar() {
    // Método para cancelar acción si es necesario
  }
}
