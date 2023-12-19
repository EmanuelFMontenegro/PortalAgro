import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userEmail: string = '';
  private userId: number | null = null;
  private loginUrl = 'http://localhost:8095/api/auth/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { username, password }).pipe(
      map(response => {
        const token = response.token; // Asegúrate de que el token se recibe aquí
        console.log("JWT Token:", token); // Para depuración

        const decodedToken = jwtDecode<{ email: string, userId: number }>(token);
        console.log("Decoded Token:", decodedToken); // Para depuración

        this.userEmail = decodedToken.email;
        this.userId = decodedToken.userId;

        console.log('token',this.userId)

        return { email: decodedToken.email, id: decodedToken.userId };
      })
    );
  }

  getUserEmail(): string {
    return this.userEmail;
  }

  getUserId(): number | null {
    return this.userId;
  }

  getToken(): string | null {
    return localStorage.getItem('token'); // Asegúrate de que esta es la forma en que almacenas y accedes al token
  }

  // ... cualquier otro método necesario para tu servicio ...
}
