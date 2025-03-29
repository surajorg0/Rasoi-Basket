import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink]
})
export class HomePage implements OnInit {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // If user is not authorized to access normal user pages, redirect them
    if (this.authService.isAuthenticated() && !this.authService.isUser()) {
      this.redirectBasedOnRole();
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  private redirectBasedOnRole(): void {
    const role = this.authService.getUserRole();
    
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
      // Default case (user) is already handled by staying on this page
    }
  }
} 