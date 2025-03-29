import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
  IonCardContent, IonButton, IonIcon, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonCardContent, 
    IonButton, 
    IonIcon,
    IonImg
  ]
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;

  constructor(private cartService: CartService) {
    addIcons({ cartOutline });
  }

  ngOnInit() {
  }

  handleImageError(event: any) {
    // Replace the broken image with the placeholder
    event.target.src = 'assets/images/placeholder.svg';
  }

  addToCart() {
    const success = this.cartService.addToCart(this.product);
    if (!success) {
      // Could show a message here explaining why the item couldn't be added
      console.warn('Could not add product to cart - may be from a different seller');
    }
  }
}
