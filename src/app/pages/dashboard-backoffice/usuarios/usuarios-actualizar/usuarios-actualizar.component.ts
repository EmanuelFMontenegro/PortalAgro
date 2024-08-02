import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { DashboardBackOfficeService } from '../../dashboard-backoffice.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ElementRef, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

type UserType =
  | 'administrator'
  | 'superuser'
  | 'technical'
  | 'operator'
  | 'cooperative'
  | 'manager';

interface Departamento {
  id: number;
  name: string;
}
interface Role {
  code: number;
  name: string;
}
export interface User {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  telephone: string;
  function: string;
  specialty: string;
  matricula?: string;
  urlImageMatricula?: string;
  license: string;
  urlImageLicense?: string;
  departmentAssigned: number[];
  descriptions?: string;
  company_id: number;
  user: {
    id: number;
    username: string;
    account_active: boolean;
    accountNonLocked: boolean;
    failedAttempts: number;
    lockeTime?: string;
    role: {
      id: number;
      name: string;
      permissions: { name: string }[];
      typeRole: number;
      active: boolean;
    };
  };
}

@Component({
  selector: 'app-usuarios-actualizar',
  templateUrl: './usuarios-actualizar.component.html',
  styleUrls: ['./usuarios-actualizar.component.sass'],
})
export class UsuariosActualizarComponent implements OnInit {
  @ViewChild('departmentInput') departmentInput!: ElementRef;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  departamentoVacio = false;
  userForm: FormGroup = this.fb.group({});
  formData: any = {};
  userType: UserType | null = null;
  departamentos: Departamento[] = [];
  departamentosSeleccionados: Departamento[] = [];
  item: any;
  filteredDepartments!: Observable<any[]>;
  departmentCtrl = new FormControl();
  id: number | undefined;
  name: string = '';
  lastname: string = '';
  dni: string = '';
  password: string = '';
  confirmPassword: string = '';
  activarSpinner: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService,
    public dashboardBackOffice: DashboardBackOfficeService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    this.dashboardBackOffice.dataTitulo.next({
      titulo: '¡Acá podrás Actualizar a los usuarios del Sistema!',
      subTitulo: '',
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.getUserDetails();
    this.cargarDepartamentos();
    this.getDepartmentNames();
  }

  initForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, this.matchPasswords]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]], // Ejemplo de validación para DNI
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      departmentAssigned: this.fb.array([]),
      assignedDepartment: [''],
      function: [''],
      specialty: [''],
      razonSocial: [''],
      address: [''],
      cuit: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]], // Ejemplo de validación para CUIT
      matricula: [''],
      license: [''],
    });
  }

  // Validador personalizado para confirmar la contraseña
  matchPasswords(control: AbstractControl): { [key: string]: boolean } | null {
    const formGroup = control.parent as FormGroup;
    if (formGroup) {
      const password = formGroup.get('password')?.value;
      if (password !== control.value) {
        return { passwordsMismatch: true };
      }
    }
    return null;
  }

  getUserDetails() {
    const storedUserType = localStorage.getItem('UserType');
    if (storedUserType) {
      const userTypeObject = JSON.parse(storedUserType);
      this.id = userTypeObject.id;
      const userType = userTypeObject.typeUser.trim().toLowerCase(); // Normalización del tipo de usuario

      // Normalización del tipo de usuario
      switch (userType) {
        case 'gerente general':
          this.userType = 'manager';
          break;
        case 'técnico':
          this.userType = 'technical';
          break;
        case 'piloto':
          this.userType = 'operator';
          break;
        case 'super admin':
          this.userType = 'superuser';
          break;
        case 'administrador':
          this.userType = 'administrator';
          break;
        case 'cooperativa':
          this.userType = 'cooperative';
          break;
        default:
          this.userType = userType as UserType; // Asignar tipo de usuario directamente si es válido
          break;
      }

      const userId = userTypeObject.id;

      if (this.userType === 'manager') {
        this.apiService.getManagerById(userId).subscribe(
          (userDetails: any) => {
            this.fillForm(userDetails, true);
          },
          (error) => {
            console.error('Error al obtener usuario:', error);
            this.toastr.error('Error al obtener usuario');
          }
        );
      } else if (['administrator', 'superuser'].includes(this.userType)) {
        this.openDialog();
      } else if (
        ['technical', 'operator', 'cooperative'].includes(this.userType)
      ) {
        this.apiService
          .getUserByRoleAndId(
            this.userType as 'technical' | 'operator' | 'cooperative',
            userId
          )
          .subscribe(
            (userDetails: any) => {

              this.fillForm(userDetails, false);
            },
            (error) => {
              console.error('Error al obtener usuario:', error);
              this.toastr.error('Error al obtener usuario');
            }
          );
      } else {
        console.error('Tipo de usuario no válido:', this.userType);
        this.toastr.error('Tipo de usuario no válido.');
      }
    } else {
      this.toastr.error('No se encontró ningún perfil de usuario.');
    }
  }

  fillForm(userData: any, isManager: boolean) {
    const user = isManager ? userData.userResponseDTO : userData.user;

    this.userForm.patchValue({
      name: userData.name || '',
      lastname: userData.lastname || '',
      dni: userData.dni || '',
      username: user.username,
      password: '',
      role: userData.role || '',
      telephone: userData.telephone,
      departmentAssigned: userData.departmentAssigned || [],
      function: userData.function || '',
      specialty: userData.specialty || '',
      razonSocial: userData.razonSocial || '',
      address: userData.address || '',
      cuit: userData.cuit || '',
      matricula: userData.matricula || '',
      license: userData.license || '',
    });

    const existingDeptIds = new Set(
      this.departamentosSeleccionados.map((d) => d.id)
    );
    const newSelectedDepts = (userData.departmentAssigned || [])
      .filter((deptId: number) => !existingDeptIds.has(deptId))
      .map((deptId: number) => {
        const selectedDept = this.departamentos.find(
          (dept) => dept.id === deptId
        );
        return selectedDept
          ? { id: selectedDept.id, name: selectedDept.name }
          : null;
      })
      .filter((dept: Departamento | null) => dept !== null) as Departamento[];

    this.departamentosSeleccionados = [
      ...this.departamentosSeleccionados,
      ...newSelectedDepts,
    ];

    const departmentArray = this.userForm.get(
      'departmentAssigned'
    ) as FormArray;
    departmentArray.clear();
    this.departamentosSeleccionados.forEach((dept) =>
      departmentArray.push(this.fb.group(dept))
    );
  }

  getDepartmentNames(): string[] {
    return (this.userForm.get('departmentAssigned') as FormArray).controls.map(
      (control) => {
        const deptId = control.value.id;
        const selectedDept = this.departamentos.find(
          (dept) => dept.id === deptId
        );
        return selectedDept ? selectedDept.name : '';
      }
    );
  }

  onDepartmentsSelectionChange(event: MatSelectChange): void {
    const selectedDepartments = event.value as Departamento[];
    const newSelectedDepts = selectedDepartments.filter(
      (dept) =>
        !this.departamentosSeleccionados.some(
          (selectedDept) => selectedDept.id === dept.id
        )
    );
    this.departamentosSeleccionados = [
      ...this.departamentosSeleccionados,
      ...newSelectedDepts,
    ];
    const departmentArray = this.userForm.get(
      'departmentAssigned'
    ) as FormArray;
    departmentArray.clear();
    this.departamentosSeleccionados.forEach((dept) =>
      departmentArray.push(this.fb.group(dept))
    );
  }

  getSelectedDepartmentsText(): string {
    return this.departamentosSeleccionados.map((dept) => dept.name).join(', ');
  }

  getDescripcionDepartament(idDepartament: number, listadoDepartament: any) {
    return listadoDepartament.find(
      (departamento: any) => departamento.value == idDepartament
    ).text;
  }

  cargarDepartamentos() {
    this.apiService.getAllDepartments().subscribe(
      (response) => {
        if (response && response.list && response.list.length > 0) {
          const departamentos = response.list[0];
          this.departamentos = departamentos.map((dept: any) => ({
            id: dept.id,
            name: dept.name,
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
      },
      (error) => {
        console.error('Error al cargar departamentos:', error);
        this.toastr.error('Error al cargar departamentos');
      }
    );
  }
  actualizarDepartamentosAsignados() {
    if (Array.isArray(this.formData.departmentAssigned)) {
    } else {
      this.formData.departmentAssigned = [];
    }
  }

  cancelar() {
    this.resetearFormulario();
    this.router.navigate(['dashboard-backoffice/usuarios-filtro']);
  }

  resetearFormulario() {
    this.userForm.reset();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      disableClose: true,
      closeOnNavigation: false,
      data: {
        message: 'No tiene autorización para ver esta información.',
        buttonText: 'Aceptar',
        showCancel: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result) {
        this.router.navigate(['dashboard-backoffice/usuarios-filtro']);
      }
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    // Aquí debes ajustar 'id' según tus necesidades
    this.departamentosSeleccionados.push({ id: 0, name: value.trim() });
    this.departmentInput.nativeElement.value = '';
  }

  addDepartment(event: MatChipInputEvent): void {
    const input = event.input;
    const value = (event.value || '').trim();
    if (value) {
      const newDepartment = {
        id: this.departamentosSeleccionados.length + 1,
        name: value,
      };
      this.departamentosSeleccionados.push(newDepartment);
      this.userForm
        .get('departmentAssigned')
        ?.setValue([...this.departamentosSeleccionados]);
    }
    if (input) {
      input.value = '';
    }
    this.departmentCtrl.setValue(null);
  }

  removeDepartment(department: Departamento): void {
    // Eliminar del array de departamentos seleccionados
    const index = this.departamentosSeleccionados.findIndex(
      (d) => d.id === department.id
    );
    if (index >= 0) {
      this.departamentosSeleccionados.splice(index, 1);
      // Actualizar el FormArray
      const departmentArray = this.userForm.get(
        'departmentAssigned'
      ) as FormArray;
      const formGroupIndex = departmentArray.controls.findIndex(
        (control: any) => control.value.id === department.id
      );
      if (formGroupIndex >= 0) {
        departmentArray.removeAt(formGroupIndex);
      }
    }
  }
  getDepartamentosNoSeleccionados(): Departamento[] {
    return this.departamentos.filter(
      (dept) =>
        !this.departamentosSeleccionados.some(
          (selectedDept) => selectedDept.id === dept.id
        )
    );
  }

  updateAllUsers(): void {
    if (!this.userForm.touched) {
      this.toastr.warning(
        'Para actualizar la información, por favor modifique al menos un campo del formulario.'
      );
      return;
    } else {
      // Lógica para actualizar usuarios

    }

    const storedUserType = localStorage.getItem('UserType');

    if (storedUserType) {
      const userTypeObject = JSON.parse(storedUserType);
      this.id = userTypeObject.id;
      let userType = userTypeObject.typeUser.toLowerCase().trim();

      // Ajustar el tipo de usuario si es necesario
      if (userType === 'gerente general') {
        userType = 'manager';
      } else if (userType === 'técnico') {
        // Normalizar 'Técnico' a 'technical'
        userType = 'technical';
      } else if (userType === 'cooperativa') {
        // Normalizar 'cooperativa' a 'cooperative'
        userType = 'cooperative';
      } else if (userType === 'piloto') {
        userType = 'operator';
      }

      // Llamar al método adecuado basado en el tipo de usuario
      switch (userType) {
        case 'manager':
          this.actualizarManager();
          break;
        case 'technical':
          this.actualizarTechnical();
          break;
        case 'operator':
          this.actualizarOperator();
          break;
        case 'cooperative':
          this.actualizarCooperative();
          break;
        default:
          console.error('Tipo de usuario inexistente:', userType);
      }
    } else {
      console.error('No se encontró el tipo de usuario en localStorage');
    }
  }

  actualizarManager() {
    // Verificar si el formulario es válido

    const userData = {
      ...this.userForm.value,
      company_id: this.formData.company?.id || 1,
      role: this.getRoleIdByName(this.formData.role?.name || '') || 8,
    };

    // Verificar si se deben actualizar las contraseñas
    const updatePassword =
      this.userForm.get('password')?.value &&
      this.userForm.get('confirmPassword')?.value;

    // Llamar al servicio para actualizar los detalles del manager
    this.apiService.updateManagerDetails(this.id!, userData).subscribe(
      (response) => {

        this.toastr.success('Datos actualizados exitosamente');
        this.router.navigate(['dashboard-backoffice/usuarios-filtro']);

        // Verificar y enviar la contraseña si corresponde
        if (updatePassword) {
          // Verificar si las contraseñas coinciden
          if (
            this.userForm.get('password')?.value !==
            this.userForm.get('confirmPassword')?.value
          ) {
            this.toastr.error('Las contraseñas no coinciden');
          } else {
            this.apiService
              .updateManagerPassword(
                this.id!,
                this.userForm.get('password')?.value,
                this.userForm.get('confirmPassword')?.value
              )
              .subscribe(
                () => {
                  this.toastr.success('Contraseña actualizada exitosamente');
                },
                (error) => {
                  console.error('Error al actualizar contraseña:', error);
                  this.toastr.error('Error al actualizar la contraseña');
                }
              );
          }
        }
      },
      (error) => {
        this.handleUpdateError(error);
      }
    );
  }

  actualizarTechnical() {
    const companyId = this.formData.company?.id || 2;
    const selectedRole = this.userForm.get('role')?.value;
    const roleId = selectedRole ? selectedRole.id : 3;

    const departmentAssignedIds =
      this.userForm
        .get('departmentAssigned')
        ?.value.map((dept: any) => dept.id) || [];



    const userData = {
      ...this.userForm.value,
      company_id: companyId,
      role: roleId,
      departmentAssigned: departmentAssignedIds,
      matricula: this.userForm.get('matricula')?.value || '',
      license: this.userForm.get('license')?.value || '',
    };



    const updatePassword =
      this.userForm.get('password')?.value &&
      this.userForm.get('confirmPassword')?.value;

    this.apiService.updateTechnicalDetails(this.id!, userData).subscribe(
      (response) => {

        this.toastr.success('Datos actualizados exitosamente');
        this.router.navigate(['dashboard-backoffice/usuarios-filtro']);

        if (updatePassword) {
          if (
            this.userForm.get('password')?.value !==
            this.userForm.get('confirmPassword')?.value
          ) {
            this.toastr.error('Las contraseñas no coinciden');
          } else {
            this.apiService
              .updateTechnicalPassword(
                this.id!,
                this.userForm.get('password')?.value,
                this.userForm.get('confirmPassword')?.value
              )
              .subscribe(
                () => {
                  this.toastr.success('Contraseña actualizada exitosamente');
                },
                (error) => {
                  console.error('Error al actualizar contraseña:', error);
                  this.toastr.error('Error al actualizar la contraseña');
                }
              );
          }
        }
      },
      (error) => {
        this.handleUpdateError(error);
      }
    );
  }

  actualizarOperator(): void {
    const companyId = this.userForm.get('company_id')?.value || 2;
    const selectedRole = this.userForm.get('role')?.value;
    const roleId = selectedRole ? selectedRole.id : 5;

    const departmentAssignedIds =
      this.userForm
        .get('departmentAssigned')
        ?.value.map((dept: any) => dept.id) || [];

    const userData = {
      ...this.userForm.value,
      company_id: companyId,
      role: roleId,
      departmentAssigned: departmentAssignedIds,
      matricula: this.userForm.get('matricula')?.value || '',
      license: this.userForm.get('license')?.value || '',
    };



    const updatePassword =
      this.userForm.get('password')?.value &&
      this.userForm.get('confirmPassword')?.value;

    this.apiService.updateOperator(this.id!, userData).subscribe(
      (response) => {

        this.toastr.success('Datos actualizados exitosamente');
        this.router.navigate(['dashboard-backoffice/usuarios-filtro']);

        if (updatePassword) {
          if (
            this.userForm.get('password')?.value !==
            this.userForm.get('confirmPassword')?.value
          ) {
            this.toastr.error('Las contraseñas no coinciden');
          } else {
            this.apiService
              .updateOperatorPassword(
                this.id!,
                this.userForm.get('password')?.value,
                this.userForm.get('confirmPassword')?.value
              )
              .subscribe(
                () => {
                  this.toastr.success('Contraseña actualizada exitosamente');
                },
                (error) => {
                  console.error('Error al actualizar contraseña:', error);
                  this.toastr.error('Error al actualizar la contraseña');
                }
              );
          }
        }
      },
      (error) => {
        console.error('Error al actualizar los datos del operador:', error);
        this.toastr.error('Error al actualizar los datos del operador');
      }
    );
  }

  actualizarCooperative(): void {
    const companyId = this.userForm.get('company_id')?.value || 2;
    const selectedRole = this.userForm.get('role')?.value;
    const roleId = selectedRole ? selectedRole.id : 6;

    const departmentAssignedIds = this.departamentosSeleccionados.map(
      (dept) => dept.id
    );

    const cooperativeData = {
      ...this.userForm.value,
      company_id: companyId,
      role: roleId,
      departmentAssigned: departmentAssignedIds,
      cuit: this.userForm.get('cuit')?.value || '',
      razonSocial: this.userForm.get('razonSocial')?.value || '',
      address: this.userForm.get('address')?.value || '',
    };



    this.apiService.updateCooperative(this.id!, cooperativeData).subscribe(
      (response) => {

        this.toastr.success('Datos actualizados exitosamente');

        const password = this.userForm.get('password')?.value;
        const confirmPassword = this.userForm.get('confirmPassword')?.value;

        if (password && confirmPassword) {
          if (password !== confirmPassword) {
            this.toastr.error('Las contraseñas no coinciden');
          } else {
            this.apiService
              .updateCooperativePassword(this.id!, password, confirmPassword)
              .subscribe(
                () => {
                  this.toastr.success('Contraseña actualizada exitosamente');
                },
                (error) => {
                  console.error('Error al actualizar la contraseña:', error);
                  this.toastr.error('Error al actualizar la contraseña');
                }
              );
          }
        }

        this.router.navigate(['dashboard-backoffice/usuarios-filtro']);
      },
      (error) => {
        console.error(
          'Error al actualizar los datos de la cooperativa:',
          error
        );
        this.toastr.error('Error al actualizar los datos de la cooperativa');
      }
    );
  }

  handleUpdateError(error: any) {
    console.error('Error al actualizar datos:', error);

    const errorCode = error?.error?.code;
    const errorDetails = error?.error?.listDetails;

    // Verificar códigos de error específicos y manejarlos
    if (errorCode === 998) {
      this.toastr.error(
        'El usuario que desea crear ya existe. Prueba con otro email.'
      );
    } else if (errorCode === 4012 && errorDetails?.role) {
      this.toastr.error(
        'Error en el campo role: ' + errorDetails.role,
        'Atención'
      );
    } else {
      this.toastr.error('Error al actualizar datos');
    }
  }

  handleUpdatePasswordError(error: any) {
    console.error('Error al actualizar contraseña:', error);

    // Manejar el error de actualización de contraseña según sea necesario
    this.toastr.error('Error al actualizar la contraseña');
  }

  // Función para obtener el ID del rol por nombre
  getRoleIdByName(roleName: string): number | null {
    const role = this.roles.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );
    return role ? role.code : null;
  }

  // Array de roles
  roles: Role[] = [
    { code: 4, name: 'ROLE_TECHNICIAN_GENERAL' },
    { code: 3, name: 'ROLE_TECHNICIAN_LOCATION' },
    { code: 5, name: 'ROLE_OPERATOR' },
    { code: 6, name: 'ROLE_COOPERATIVE' },
    { code: 7, name: 'ROLE_PRODUCER' },
    { code: 8, name: 'ROLE_MANAGER' },
  ];
}
