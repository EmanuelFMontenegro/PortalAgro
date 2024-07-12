import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { DashboardBackOfficeService } from '../../dashboard-backoffice.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

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
@Component({
  selector: 'app-usuarios-actualizar',
  templateUrl: './usuarios-actualizar.component.html',
  styleUrls: ['./usuarios-actualizar.component.sass'],
})
export class UsuariosActualizarComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  departamentoVacio = false;
  userForm: FormGroup = this.fb.group({});
  formData: any = {};
  userType: UserType | null = null;
  departamentos: Departamento[] = [];
  departamentosSeleccionados: Departamento[] = [];
  item: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService,
    public dashboardBackOffice: DashboardBackOfficeService,
    private dialog: MatDialog // Inyecta MatDialog
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
  }

  initForm() {
    this.userForm = this.fb.group({
      name: [''],
      lastname: [''],
      dni: [''],
      username: [''],
      email: [''],
      password: [''],
      departmentAssigned: [] as number[],
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
      const companyId = userTypeObject.companyId;

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
      } else if (
        this.userType === 'administrator' ||
        this.userType === 'superuser'
      ) {
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
    if (isManager) {
      this.userForm.patchValue({
        name: userData.name || '',
        lastname: userData.lastname || '',
        dni: userData.dni || '',
        username: userData.userResponseDTO?.username || '',
        email: userData.userResponseDTO?.username || '',
        password: '',
      });
    } else {
      this.userForm.patchValue({
        name: userData.name || '',
        lastname: userData.lastname || '',
        dni: userData.dni || '',
        username: userData.user?.username || '',
        email: userData.user?.username || '',
        password: '',
        assignedDepartment: userData.departmentAssigned || '',
        function: userData.function || '',
        specialty: userData.specialty || '',
        businessName: userData.businessName || '',
        address: userData.address || '',
        cuit: userData.cuit || '',
        registration: userData.matricula || '',
        license: userData.license || '',
      });
    }

    console.log(
      'Datos del usuario en formData que se manda al formulario:',
      this.userForm.value
    );
  }

  enviarFormulario() {
    // Lógica para enviar el formulario
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

  getDescripcionDepartament(idDepartament: number, listadoDepartament: any) {
    return listadoDepartament.find((departamento: any) => departamento.value == idDepartament).text;
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

  addDepartment(event: MatChipInputEvent, modelName: string): void {
    const input = event.input;
    const value = event.value;

    // Añadir el chip al array de departamentos si no está vacío
    if ((value || '').trim()) {
      this.formData[modelName] = this.formData[modelName] || [];
      this.formData[modelName].push(value.trim());
    }

    // Limpiar el valor de entrada
    if (input) {
      input.value = '';
    }


  }
  removeDepartment(department: string, modelName: string) {
    // Implementa la lógica para remover un departamento
    this.formData[modelName] = this.formData[modelName].filter((dep: string) => dep !== department);
  }
}
