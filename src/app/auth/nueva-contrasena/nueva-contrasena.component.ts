import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nueva-contrasena',
  templateUrl: './nueva-contrasena.component.html',
  styleUrls: ['./nueva-contrasena.component.sass']
})
export class NuevaContrasenaComponent implements OnInit {
  hasErrors: boolean = false;
  passwordResetForm!: FormGroup;
  hideNewPassword = true;
  hideConfirmPassword = true;
  token: string = '';

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  navigateAndClose(): void {
    this.router.navigate(['/login']).then(() => {
      try {
        window.close();
      } catch (e) {
        console.error("No se pudo cerrar la pestaña", e);
      }
    });
  }

  ngOnInit(): void {
    this.passwordResetForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    });

    this.passwordResetForm.valueChanges.subscribe(() => this.passwordMatchValidator(this.passwordResetForm));

    // Extrae el token del path de la ruta
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token') || '';
    });
  }


  toggleNewPasswordVisibility(): void {
    this.hideNewPassword = !this.hideNewPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  isFormFullyValid(): boolean {
    return this.passwordResetForm.valid &&
           this.passwordResetForm.get('newPassword')?.value === this.passwordResetForm.get('confirmPassword')?.value;
  }

  private passwordMatchValidator(formGroup: FormGroup): void {
    const newPassword = formGroup.get('newPassword')!.value;
    const confirmPassword = formGroup.get('confirmPassword')!.value;

    if (newPassword !== confirmPassword) {
      formGroup.get('confirmPassword')!.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')!.setErrors(null);
    }
  }

  onSubmit(): void {
    if (this.isFormFullyValid()) {
      const newPassword = this.passwordResetForm.get('newPassword')!.value;
      const confirmPassword = this.passwordResetForm.get('confirmPassword')!.value;

      // Usa el token extraído de la ruta
      if (this.token) {
        // Llamar a la API para cambiar la contraseña
        this.apiService.cambiarContrasena(newPassword, confirmPassword, this.token).subscribe({
          next: () => {
            this.toastr.info('Contraseña cambiada con éxito');
            // this.navigateAndClose(); metodo desactivado hasta tanto sea validado
          },
          error: (error) => {
            if (error.status === 401) {
              this.toastr.error('La solicitud de cambio de contraseña ha expirado...');
            } else {
              this.toastr.error('Ya se realizo el cambio de contraseña recientemente','Atencion');
            }
          }
        });
      } else {
        this.toastr.error('Token no encontrado en la ruta');
      }
    } else {
      this.toastr.error('Formulario no válido o no inicializado');
    }
  }
  adjustCardSize(hasError: boolean): void {
    const cardElement = document.querySelector('.nueva-contrasena-card') as HTMLElement;

    if (cardElement) {
      if (!hasError) {
        // Restaura el tamaño original de la tarjeta si no hay errores
        cardElement.style.height = '500px';
      } else {
        // Establece la altura en 535px cuando hay errores
        cardElement.style.height = '535px';
      }
    }
  }
}
