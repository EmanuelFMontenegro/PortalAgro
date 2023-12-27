import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from 'src/app/services/JwtInterceptor';


const routes: Routes = [];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    AuthModule,
    DashboardModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

  ],
   bootstrap: [AppComponent]
})
export class AppModule { }
