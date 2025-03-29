import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonMenuButton, 
  IonTitle, IonButton, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, personOutline, logInOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonMenuButton, 
    IonTitle, 
    IonButton, 
    IonIcon,
    IonBadge
  ]
})
export class HeaderComponent implements OnInit {
  @Input() title: string = 'Rasoi Basket';
  @Input() showBackButton: boolean = false;
  
  isLoggedIn: boolean = false;
  cartItemCount: number = 0;
  private cartSubscription!: Subscription;
  private authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {
    addIcons({ cartOutline, personOutline, logInOutline });
  }

  ngOnInit() {
    // Check if user is logged in
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    // Get cart item count
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = this.cartService.getCartItemsCount();
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
