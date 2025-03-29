import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Check if the user is authenticated
    if (this.authService.isAuthenticated()) {
      // Check if a specific role is required
      const requiredRole = route.data['role'] as string;
      
      if (requiredRole) {
        // Check if user has the required role
        const userRole = this.authService.getUserRole();
        
        if (requiredRole === 'admin' && this.authService.isAdmin()) {
          return true;
        }
        
        if (requiredRole === 'seller' && this.authService.isSeller()) {
          return true;
        }
        
        if (requiredRole === 'delivery' && this.authService.isDelivery()) {
          return true;
        }
        
        if (requiredRole === 'user' && this.authService.isUser()) {
          return true;
        }
        
        // If user doesn't have the required role, redirect to home
        this.router.navigate(['/']);
        return false;
      }
      
      // No specific role required, just authentication
      return true;
    }
    
    // Not authenticated, redirect to login
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
} 