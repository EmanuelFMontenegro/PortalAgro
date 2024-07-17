import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { DashboardBackOfficeService } from '../../dashboard-backoffice.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ElementRef, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

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
interface User {
  id: number;
  username: string;
  account_active: boolean;
  accountNonLocked: boolean;
  failedAttempts: number;
  lockeTime: string | null;
  role: {
    id: number;
    name: string;
    permissions: { name: string }[];
    typeRole: number;
    active: boolean;
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService,
    public dashboardBackOffice: DashboardBackOfficeService,
    private dialog: MatDialog
  ) {
    this.dashboardBackOffice.dataTitulo.next({
      titulo: '¡Acá podrás Actualizar a los usuarios del Sistema!',
      subTitulo: '',
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.getUserDetails();
    this.getDepartmentNames();
    this.cargarDepartamentos();
  }

  initForm() {
    this.userForm = this.fb.group({
      name: [''],
      lastname: [''],
      dni: [''],
      username: [''],
      password: [''],
      confirmPassword: [''],
      departmentAssigned: this.fb.array([]),
      assignedDepartment: [''],
      function: [''],
      specialty: [''],
      businessName: [''],
      address: [''],
      cuit: [''],
      registration: [''],
      license: [''],
    });
  }

  getUserDetails() {
    const storedUserType = localStorage.getItem('UserType');
    if (storedUserType) {
      const userTypeObject = JSON.parse(storedUserType);
      this.id = userTypeObject.id;
      const userType = userTypeObject.typeUser.toLowerCase();

      if (userType === 'management') {
        this.userType = 'manager';
      } else {
        this.userType = userType as UserType;
      }

      console.log('El tipo de usuario seteado:', this.userType);
      console.log('userTypeObject:', userTypeObject);
      console.log('userId:', userTypeObject.id);

      const userId = userTypeObject.id;

      if (this.userType === 'manager') {
        this.apiService.getManagerById(userId).subscribe(
          (userDetails: any) => {
            console.log(
              'Datos del usuario Manager obtenidos con el Endpoint:',
              userDetails
            );
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
              console.log(
                `Datos del usuario ${this.userType} obtenidos con el Endpoint:`,
                userDetails
              );
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
      this.toastr.error('No se encontró UserType en el almacenamiento local.');
    }
  }

  fillForm(userData: any, isManager: boolean) {
    const user = isManager ? userData.userResponseDTO : userData.user;

    this.userForm.patchValue({
      name: userData.name || '',
      lastname: userData.lastname || '',
      dni: userData.dni || '',
      username: user?.username || '',
      password: '',
      departmentAssigned: userData.departmentAssigned || [],
      function: userData.function || '',
      specialty: userData.specialty || '',
      businessName: userData.businessName || '',
      address: userData.address || '',
      cuit: userData.cuit || '',
      registration: userData.matricula || '',
      license: userData.license || '',
    });

    this.departamentosSeleccionados = (userData.departmentAssigned || [])
      .map(
        (id: number) =>
          this.departamentos.find(
            (dept: Departamento) => dept.id === id
          ) as Departamento
      )
      .filter((dept: Departamento | undefined) => dept !== undefined);

    console.log(
      'Datos del usuario en formData que se manda al formulario:',
      this.userForm.value
    );
  }

  getDepartmentNames(): string[] {
    return this.departamentosSeleccionados.map((dept) => dept.name);
  }

  getDepartamentosNoSeleccionados(): Departamento[] {
    return this.departamentos.filter(
      (dept) =>
        !this.departamentosSeleccionados.some(
          (selectedDept) => selectedDept.id === dept.id
        )
    );
  }

  onDepartmentsSelectionChange(event: MatSelectChange) {
    const selectedDepartments = event.value as Departamento[];

    if (!Array.isArray(selectedDepartments)) {
      this.departamentosSeleccionados.push(selectedDepartments);
    } else {
      this.departamentosSeleccionados.push(...selectedDepartments);
    }
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
      console.log('Dialog cerrado con resultado:', result);
      if (result) {
        this.router.navigate(['dashboard-backoffice/usuarios-filtro']);
      }
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    // Aquí debes ajustar 'id' según tus necesidades
    this.departamentosSeleccionados.push({ id: 0, name: value.trim() });
    this.departmentInput.nativeElement.value = ''; // Limpiar el input después de la selección
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

  remove(department: any): void {
    const index = this.departamentosSeleccionados.indexOf(department);
    if (index >= 0) {
      this.departamentosSeleccionados.splice(index, 1);
      this.userForm
        .get('departmentAssigned')
        ?.setValue([...this.departamentosSeleccionados]);
    }
  }
  actualizarManager() {
    // Verificar si el formulario es válido
    if (this.userForm.valid) {
      const userData = {
        ...this.userForm.value,
        company_id: this.formData.company?.id || 1,
        role: this.getRoleIdByName(this.formData.role?.name || '') || 1,
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
        },
        (error) => {
          this.toastr.error('Error al actualizar datos');
        }
      );
    } else {
      this.toastr.error('Por favor, completa correctamente el formulario');
    }
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
  getRoleIdByName(roleName: string): number | undefined {
    const role = this.roles.find((r) => r.name === roleName);
    return role ? role.code : undefined;
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
