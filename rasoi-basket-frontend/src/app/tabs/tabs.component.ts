import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  home, 
  searchOutline, 
  search, 
  cartOutline, 
  cart, 
  personOutline, 
  person 
} from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { 
  IonTabs, 
  IonTabBar, 
  IonTabButton, 
  IonIcon, 
  IonLabel,
  IonRouterOutlet
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.component.html',
  styleUrls: ['tabs.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterLinkActive,
    IonTabs, 
    IonTabBar, 
    IonTabButton, 
    IonIcon, 
    IonLabel,
    IonRouterOutlet
  ]
})
export class TabsComponent {
  
  constructor(private authService: AuthService) {
    addIcons({
      homeOutline, 
      home, 
      searchOutline, 
      search, 
      cartOutline, 
      cart, 
      personOutline, 
      person
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get isUser(): boolean {
    return this.authService.isUser();
  }
} 