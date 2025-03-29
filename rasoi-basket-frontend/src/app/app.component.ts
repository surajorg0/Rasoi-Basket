import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { 
  IonApp, 
  IonRouterOutlet, 
  IonMenu, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonIcon,
  IonMenuToggle,
  IonSplitPane
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  personOutline, 
  receiptOutline, 
  analyticsOutline, 
  storefrontOutline, 
  bicycleOutline, 
  logOutOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonApp, 
    IonRouterOutlet, 
    IonMenu, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonIcon,
    IonMenuToggle,
    IonSplitPane
  ],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  isSeller = false;
  isDelivery = false;
  private authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Register Ionic icons
    addIcons({
      homeOutline, 
      personOutline, 
      receiptOutline, 
      analyticsOutline, 
      storefrontOutline, 
      bicycleOutline, 
      logOutOutline
    });
  }

  ngOnInit() {
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      
      if (user) {
        this.isAdmin = this.authService.isAdmin();
        this.isSeller = this.authService.isSeller();
        this.isDelivery = this.authService.isDelivery();
      } else {
        this.isAdmin = false;
        this.isSeller = false;
        this.isDelivery = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
