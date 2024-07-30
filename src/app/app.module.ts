import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { DashboardBackofficeModule } from './pages/dashboard-backoffice/dashboard-backoffice.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from 'src/app/services/Interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxSpinnerModule } from "ngx-spinner";
import { SharedModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';
const routes: Routes = [];

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    NgxSpinnerModule.forRoot (),
    RouterModule.forRoot(routes),
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    AuthModule,
    DashboardModule,
    DashboardBackofficeModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),

      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
