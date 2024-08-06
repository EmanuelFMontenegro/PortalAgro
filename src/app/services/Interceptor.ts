import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse, // Agregar importación para manejar errores HTTP
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private spinner: NgxSpinnerService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('token'); // Cambiar a sessionStorage -antes localstorage

    // Verificar si la solicitud es para recuperar la contraseña
    const isPasswordRecoveryRequest = request.url.includes(
      '/recuper-contrasena-admin'
    );

    // Si es una solicitud para recuperar la contraseña, activa el spinner
    if (isPasswordRecoveryRequest) {
      this.spinner.show();
    }

    // Agregar el token de autorización si está disponible
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      // Manejar la respuesta y los errores
      tap(
        (event: HttpEvent<any>) => {
          // Si es una respuesta exitosa y es una solicitud para recuperar la contraseña, oculta el spinner
          if (event instanceof HttpResponse && isPasswordRecoveryRequest) {
            this.spinner.hide();
          }
        },
        (error: any) => {
          // Si hay un error y es una solicitud para recuperar la contraseña, oculta el spinner
          if (isPasswordRecoveryRequest) {
            this.spinner.hide();
          }
        }
      )
    );
  }
}
