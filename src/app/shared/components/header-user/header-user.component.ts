import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: number;
  sub: string;
  name: string;
  lastname: string;
  role: string;
}

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.sass'],
})
export class HeaderUserComponent implements OnInit, OnChanges {
  @Input() selectedName: string | null = null;
  @Input() selectedLastName: string | null = null;
  @Input() selectedEmail: string | null = null;
  @Input() selectedRole: string | null = null;
  @Input() departmentNames: string[] | null = null;

  name: string | null = null;
  lastname: string | null = null;
  email: string | null = null;
  role: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.setAuthenticatedUserData();
  }

  ngOnChanges(): void {
    if (this.selectedName !== undefined && this.selectedName !== null) {
      this.name = this.selectedName;
    }
    if (this.selectedLastName !== undefined && this.selectedLastName !== null) {
      this.lastname = this.selectedLastName;
    }
    if (this.selectedEmail !== undefined && this.selectedEmail !== null) {
      this.email = this.selectedEmail;
    }
    if (this.selectedRole !== undefined && this.selectedRole !== null) {
      this.role = this.translateRole(this.selectedRole);
    }
  }

  private setAuthenticatedUserData(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      if (this.selectedName === undefined || this.selectedName === null) {
        this.name = decoded.name;
      }
      if (this.selectedLastName === undefined || this.selectedLastName === null) {
        this.lastname = decoded.lastname;
      }
      if (this.selectedEmail === undefined || this.selectedEmail === null) {
        this.email = decoded.sub;
      }
      if (this.selectedRole === undefined || this.selectedRole === null) {
        this.role = this.translateRole(decoded.role);
      }
    } else {
      this.name = this.selectedName ?? null;
      this.lastname = this.selectedLastName ?? null;
      this.email = this.selectedEmail ?? null;
      this.role = this.translateRole(this.selectedRole ?? null);
    }
  }

  private translateRole(role: string | null): string | null {
    if (!role) return null;
    switch (role) {
      case 'SUPERUSER':
        return 'Super Admin';
      case 'ADMINISTRATOR':
        return 'Admin';
      case 'ROLE_MANAGER':
        return 'Gerente General';
      case 'TECHNICAL':
        return 'Técnico';
      case 'OPERATOR':
        return 'Piloto';
      case 'COOPERATIVE':
        return 'Cooperativa';
      default:
        return role;
    }
  }
}
