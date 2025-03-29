import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Get required role from route data
    const requiredRole = route.data['role'] as string;
    
    // Check if user is logged in and has the required role
    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getUserRole();
      
      if (userRole === requiredRole) {
        return true;
      }
      
      // Redirect to appropriate dashboard based on actual role
      console.log(`User role ${userRole} does not match required role ${requiredRole}`);
      this.redirectBasedOnRole(userRole);
      return false;
    }
    
    // Not authenticated
    this.router.navigate(['/login']);
    return false;
  }
  
  private redirectBasedOnRole(role: string | null): void {
    if (!role) {
      this.router.navigate(['/login']);
      return;
    }
    
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'seller':
        this.router.navigate(['/seller-dashboard']);
        break;
      case 'delivery':
        this.router.navigate(['/delivery-dashboard']);
        break;
      case 'user':
      default:
        this.router.navigate(['/tabs/home']);
        break;
    }
  }
} 