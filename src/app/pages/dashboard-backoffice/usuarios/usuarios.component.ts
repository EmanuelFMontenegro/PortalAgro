import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

enum TipoUsuarios {
  piloto = 'Piloto de Dron',
  cooperativa = 'Cooperativa',
  gerente = 'Gerente General',
  tecnicoGeneral = 'Técnico General',
  tecnico = 'Técnico',
}

interface DataForm {
  type: 'text' | 'file' | 'select' | 'password' | 'textarea' | 'checkbox';
  placeholder: string;
  ngModel: string;
  name: string;
  multiple?: boolean;
  options?: { value: any; text: string }[];
  readonly?: boolean;
  autocomplete?: 'on' | 'off';
}

interface Role {
  code: number;
  name: string;
}

interface Departamento {
  value: number;
  text: string;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.sass'],
})
export class UsuariosComponent implements OnInit {
  activarSpinner: boolean = false;
  departamentoVacio = false;
  titulo = 'Formulario de Usuarios';
  opciones = [
    TipoUsuarios.gerente,
    TipoUsuarios.cooperativa,
    TipoUsuarios.tecnicoGeneral,
    TipoUsuarios.tecnico,
    TipoUsuarios.piloto,
  ];
  selectedForm: TipoUsuarios = TipoUsuarios.gerente;

  dataForm: DataForm[] = [];
  formData = {
    username: '',
    password: '',
    name: '',
    lastname: '',
    dni: '',
    role: 0,
    departmentAssigned: [] as number[],
    company_id: 1,
  };

  imgMatriculaFile: File | null = null;
  imgLicenciaFile: File | null = null;
  fotoFile: File | null = null;

  departamentos: Departamento[] = [];
  departamentosSeleccionados: Departamento[] = [];

  roles: Role[] = [
    { code: 4, name: 'ROLE_TECHNICIAN_GENERAL' },
    { code: 3, name: 'ROLE_TECHNICIAN_LOCATION' },
    { code: 5, name: 'ROLE_OPERATOR' },
    { code: 6, name: 'ROLE_COOPERATIVE' },
    { code: 7, name: 'ROLE_PRODUCER' },
    { code: 8, name: 'ROLE_MANAGER' },
  ];

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.cargarDepartamentos();
    this.loadDataUserType();
  }

  cargarDepartamentos() {
    this.apiService.getAllDepartments().subscribe(
      (response) => {
        if (response && response.list && response.list.length > 0) {
          const departamentos = response.list[0];
          this.departamentos = departamentos.map((dept: any) => ({
            value: dept.id,
            text: dept.name,
          }));
        } else {
          console.error(
            'La respuesta no contiene un array de departamentos válido:',
            response
          );
          this.toastr.error(
            'Error: La respuesta no contiene un array de departamentos válido'
          );
        }
        this.seleccionoTipo();
      },
      (error) => {
        console.error('Error al cargar departamentos:', error);
        this.toastr.error('Error al cargar departamentos');
      }
    );
  }

  loadDataUserType() {
    const userType = localStorage.getItem('UserType');
    if (userType) {
      const userData = JSON.parse(userType);
      const userId = userData.id;

      // Llamada para obtener detalles del usuario por ID
      this.apiService.getUserById(userId).subscribe(
        (userDetails) => {
          console.log('Datos del usuario:', userDetails);
          this.fillFormData(userDetails); // Método para asignar datos al formulario
        },
        (error) => {
          console.error('Error al obtener datos del usuario:', error);
          this.toastr.error('Error al obtener datos del usuario');
        }
      );
    }
  }

  fillFormData(userData: any) {
    this.formData.username = userData.username;
    this.formData.name = userData.name;
    this.formData.lastname = userData.lastname;
    this.formData.dni = userData.dni;

    // Asignación de departamentos asignados, si corresponde
    if (userData.departmentAssigned) {
      this.formData.departmentAssigned = userData.departmentAssigned;
    }

    // Actualizar campos o realizar otras acciones necesarias
    this.actualizarCamposFormulario();
  }

  seleccionoTipo() {
    this.dataForm = [
      {
        type: 'text',
        placeholder: 'Email',
        ngModel: 'username',
        name: 'username',
        autocomplete: 'off',
      },
      {
        type: 'password',
        placeholder: 'Contraseña',
        ngModel: 'password',
        name: 'password',
        autocomplete: 'off',
      },
      { type: 'text', placeholder: 'Nombre', ngModel: 'name', name: 'name' },
      {
        type: 'text',
        placeholder: 'Apellido',
        ngModel: 'lastname',
        name: 'lastname',
      },
      { type: 'text', placeholder: 'DNI', ngModel: 'dni', name: 'dni' },
    ];

    switch (this.selectedForm) {
      case TipoUsuarios.tecnicoGeneral:
        this.configurarFormularioTecnicoGeneral();
        break;
      case TipoUsuarios.tecnico:
        this.configurarFormularioTecnico();
        break;
      case TipoUsuarios.cooperativa:
        this.configurarFormularioCooperativa();
        break;
      case TipoUsuarios.piloto:
        this.configurarFormularioPiloto();
        break;
      case TipoUsuarios.gerente:
      default:
        this.configurarFormularioGerente();
        break;
    }

    this.actualizarCamposFormulario();
  }

  configurarFormularioTecnicoGeneral() {
    this.dataForm.push(
      {
        type: 'select',
        placeholder: 'Departamento Asignado',
        ngModel: 'departmentAssigned',
        name: 'departmentAssigned',
        options: this.departamentos,
        multiple: true,
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
        type: 'text',
        placeholder: 'Licencia',
        ngModel: 'license',
        name: 'license',
      }
    );

    this.formData.role =
      this.roles.find((role) => role.name === 'ROLE_TECHNICIAN_GENERAL')
        ?.code ?? 0;
  }

  configurarFormularioTecnico() {
    this.configurarFormularioTecnicoGeneral();
    this.formData.role =
      this.roles.find((role) => role.name === 'ROLE_TECHNICIAN_LOCATION')
        ?.code ?? 0;
  }

  configurarFormularioCooperativa() {
    this.dataForm.push(
      {
        type: 'select',
        placeholder: 'Departamento Asignado',
        ngModel: 'departmentAssigned',
        name: 'departmentAssigned',
        options: this.departamentos,
        multiple: true,
      },
      {
        type: 'text',
        placeholder: 'Función',
        ngModel: 'function',
        name: 'function',
      },
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
        placeholder: 'CUIT',
        ngModel: 'cuit',
        name: 'cuit',
      }
    );
    this.formData.role =
      this.roles.find((role) => role.name === 'ROLE_COOPERATIVE')?.code ?? 0;
  }

  configurarFormularioPiloto() {
    this.configurarFormularioTecnico();
  }

  configurarFormularioGerente() {
    this.formData.company_id = 1;
    this.formData.role =
      this.roles.find((role) => role.name === 'ROLE_MANAGER')?.code ?? 0;
  }

  actualizarCamposFormulario() {
    this.dataForm = [...this.dataForm];
    this.actualizarDepartamentosAsignados();
  }

  actualizarDepartamentosAsignados() {
    if (Array.isArray(this.formData.departmentAssigned)) {
    } else {
      this.formData.departmentAssigned = [];
    }
  }

  removerDepartamento(dept: Departamento) {
    this.formData.departmentAssigned = this.formData.departmentAssigned.filter(
      (value: number) => value !== dept.value
    );
    this.actualizarDepartamentosAsignados();
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

  updateFormData() {
    console.log('Formulario actualizado:', this.formData);
  }

  onFormSubmitted(formData: any) {
    this.formData = formData;

    switch (this.selectedForm) {
      case TipoUsuarios.tecnicoGeneral:
        this.formData.role =
          this.roles.find((role) => role.name === 'ROLE_TECHNICIAN_GENERAL')
            ?.code ?? 0;
        break;
      case TipoUsuarios.tecnico:
        this.formData.role =
          this.roles.find((role) => role.name === 'ROLE_TECHNICIAN_LOCATION')
            ?.code ?? 0;
        break;
      case TipoUsuarios.cooperativa:
        this.formData.role =
          this.roles.find((role) => role.name === 'ROLE_COOPERATIVE')?.code ??
          0;
        break;
      case TipoUsuarios.piloto:
        this.formData.role =
          this.roles.find((role) => role.name === 'ROLE_OPERATOR')?.code ?? 0;
        break;
      case TipoUsuarios.gerente:
      default:
        this.formData.role =
          this.roles.find((role) => role.name === 'ROLE_MANAGER')?.code ?? 0;
        break;
    }

    this.actualizarDepartamentosAsignados();
  }

  enviarFormulario() {
    if (
      !this.formData.username ||
      !this.formData.password ||
      !this.formData.name ||
      !this.formData.lastname ||
      !this.formData.dni
    ) {
      this.toastr.error('Por favor completa todos los campos obligatorios.');
      return;
    }

    // Verificación del campo de departamento
    if (
      this.selectedForm !== TipoUsuarios.gerente &&
      this.formData.departmentAssigned.length === 0
    ) {
      this.toastr.error(
        'El campo Departamento Asignado es obligatorio.',
        'Atención !!!'
      );
      this.departamentoVacio = true; // Bandera para mostrar mensaje en el HTML
      return;
    } else {
      this.departamentoVacio = false; // Resetea la bandera si el campo está lleno
    }

    let requestData: any;

    switch (this.selectedForm) {
      case TipoUsuarios.tecnicoGeneral:
      case TipoUsuarios.tecnico:
        requestData = {
          ...this.formData,
          isPreActivate: 'true',
          autogeneratePass: 'false',
          role: this.formData.role,
        };
        this.registrarTecnico(requestData);
        break;
      case TipoUsuarios.cooperativa:
        requestData = {
          ...this.formData,
          isPreActivate: 'true',
          autogeneratePass: 'false',
          role: this.formData.role,
        };
        this.registrarCooperativa(requestData);
        break;
      case TipoUsuarios.piloto:
        requestData = {
          ...this.formData,
          isPreActivate: 'false',
          autogeneratePass: 'false',
          role: 5,
        };
        this.registrarPiloto(requestData);
        break;
      case TipoUsuarios.gerente:
      default:
        requestData = {
          username: this.formData.username,
          password: this.formData.password,
          name: this.formData.name,
          lastname: this.formData.lastname,
          dni: this.formData.dni,
          company_id: 1,
          role: this.formData.role,
          isPreActivate: 'true',
          autogeneratePass: 'false',
        };
        delete requestData.departmentAssigned;
        this.registrarGerente(requestData);
        break;
    }
  }

  registrarTecnico(data: any) {
    this.activarSpinner = true;
    this.apiService.registrarTecnico(data).subscribe(
      (response) => {
        console.log('Técnico registrado correctamente:', response);
        this.activarSpinner = false;
        this.toastr.success('Técnico registrado correctamente');
        this.resetearFormulario();
        this.router.navigate(['dashboard-backoffice/usuarios-filtro']);
      },
      (error) => {
        console.error('Error al registrar técnico:', error);
        this.toastr.error('Error al registrar técnico');
      }
    );
  }

  registrarPiloto(data: any) {
    this.activarSpinner = true;
    this.apiService.registrarPiloto(data).subscribe(
      (response) => {
        this.activarSpinner = false;
        this.toastr.success('Piloto registrado correctamente');
        this.resetearFormulario();
        this.router.navigate(['dashboard-backoffice/usuarios-filtro']);
      },
      (error) => {
        if (error?.error?.code === 4002) {
          this.toastr.warning(
            'El usuario ya fue registrado, intente con otro email'
          );
        } else {
          console.error('Error al registrar piloto:', error);
          this.toastr.error('Error al registrar piloto');
        }
      }
    );
  }

  registrarGerente(data: any) {
    this.activarSpinner = true;
    this.apiService.addAdministrator(data).subscribe(
      (response) => {
        this.activarSpinner = false;
        this.toastr.success('Gerente registrado correctamente');
        this.resetearFormulario();
        this.router.navigate(['dashboard-backoffice/usuarios-filtro']);
      },
      (error) => {
        console.error('Error al registrar gerente:', error);

        if (error.error && error.error.code === 4002) {
          this.toastr.error('El usuario ya existe, prueba con otro Email');
        } else {
          this.toastr.error('Error al registrar gerente');
        }
      }
    );
  }

  registrarCooperativa(data: any) {
    this.activarSpinner = true;
    this.apiService.registrarCooperativa(data).subscribe(
      (response) => {
        this.activarSpinner = false;
        this.toastr.success('Cooperativa registrada correctamente');
        this.resetearFormulario();
        this.router.navigate(['dashboard-backoffice/usuarios-filtro']);
      },
      (error) => {
        console.error('Error al registrar la cooperativa:', error);
        this.toastr.error('Error al registrar la Cooperativa');
      }
    );
  }
  cancelar() {
    this.resetearFormulario();
    this.router.navigate(['dashboard-backoffice/usuarios-filtro']);
  }

  resetearFormulario() {
    const self = this as any;

    this.dataForm.forEach((campo) => {
      if (campo.type === 'file') {
        self[campo.ngModel + 'File'] = null;
      } else {
        self.formData[campo.ngModel] = '';
      }
    });

    this.formData.role = 0;
    this.formData.departmentAssigned = [];
    this.formData.company_id = 1;
    this.seleccionoTipo();
  }
}
