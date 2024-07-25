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
  @Input() selectedRole: number | null = null; // Recibe el roleId
  @Input() departmentNames: string[] | null = null;

  name: string | null = null;
  lastname: string | null = null;
  email: string | null = null;
  role: string | null = null;

  private roleMapping = new Map<number, string>([
    [1, 'ROLE_SUPERUSER'],
    [2, 'ROLE_ADMINISTRATOR'],
    [3, 'ROLE_MANAGER'],
    [4, 'ROLE_TECHNICAL'],
    [5, 'ROLE_OPERATOR'],
    [6, 'ROLE_COOPERATIVE'],
  ]);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.setAuthenticatedUserData();
  }

  ngOnChanges(): void {
    this.updateUserData();
  }

  private setAuthenticatedUserData(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      this.name = this.selectedName ?? decoded.name;
      this.lastname = this.selectedLastName ?? decoded.lastname;
      this.email = this.selectedEmail ?? decoded.sub;

      // Convert `number` to `string` if necessary
      const roleAsString: string | null = typeof this.selectedRole === 'number'
        ? this.roleMapping.get(this.selectedRole) || null
        : this.selectedRole;

      this.role = this.translateRole(roleAsString ?? decoded.role);
    } else {
      this.updateUserData();
    }
  }


  private updateUserData(): void {
    console.log('Update User Data:', {
      selectedName: this.selectedName,
      selectedLastName: this.selectedLastName,
      selectedEmail: this.selectedEmail,
      selectedRole: this.selectedRole,
    });

    this.name = this.selectedName ?? null;
    this.lastname = this.selectedLastName ?? null;
    this.email = this.selectedEmail ?? null;
    this.role = this.selectedRole ? this.roleMapping.get(this.selectedRole) || 'Unknown' : null;

    console.log('Updated User Data:', { name: this.name, lastname: this.lastname, email: this.email, role: this.role });
  }


  private translateRole(role: string | number | null): string | null {
    if (role === null) return null;

    // Convert `number` to `string` if needed
    const roleName = typeof role === 'number' ? this.roleMapping.get(role) : role;

    switch (roleName) {
      case 'ROLE_SUPERUSER':
        return 'Super Admin';
      case 'ROLE_ADMINISTRATOR':
        return 'Admin';
      case 'ROLE_MANAGER':
        return 'Gerente General';
      case 'ROLE_TECHNICAL':
        return 'Técnico';
      case 'ROLE_OPERATOR':
        return 'Piloto';
      case 'ROLE_COOPERATIVE':
        return 'Cooperativa';
      default:
        return roleName || null; // Return null if roleName is undefined
    }
  }


}
